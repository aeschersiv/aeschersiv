"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight, Check, ChevronRight } from "lucide-react";
import { assessmentTree, getNode, getNextNodeId, interpolateQuestion } from "@/lib/decision-tree";
import { DecisionNode } from "@/types";

interface Props {
  onComplete: (data: Record<string, unknown>) => void;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  options?: DecisionNode["options"];
  inputType?: DecisionNode["inputType"];
  inputConfig?: DecisionNode["inputConfig"];
  category?: string;
  answered?: boolean;
}

export default function ChatInterface({ onComplete }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>("welcome");
  const [assessmentData, setAssessmentData] = useState<Record<string, unknown>>({});
  const [textInput, setTextInput] = useState("");
  const [sliderValue, setSliderValue] = useState(5);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  const assessmentDataRef = useRef<Record<string, unknown>>({});
  const currentNodeIdRef = useRef<string>("welcome");

  const totalNodes = Object.keys(assessmentTree).length;

  // Keep refs in sync with state
  assessmentDataRef.current = assessmentData;
  currentNodeIdRef.current = currentNodeId;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addAssistantMessage = useCallback((node: DecisionNode, data: Record<string, unknown>) => {
    setIsTyping(true);
    const question = interpolateQuestion(node.question, data);

    setTimeout(() => {
      setIsTyping(false);
      const msg: Message = {
        id: `assistant-${node.id}`,
        role: "assistant",
        content: question,
        options: node.options,
        inputType: node.inputType,
        inputConfig: node.inputConfig,
        category: node.category,
      };
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (node.inputType === "slider") {
        setSliderValue(node.inputConfig?.min === 0 ? 0 : (node.inputConfig?.min || 1));
      }
    }, 600);
  }, []);

  useEffect(() => {
    // Guard against React strict mode double-firing
    if (initializedRef.current) return;
    initializedRef.current = true;
    const node = getNode("welcome");
    if (node) addAssistantMessage(node, {});
  }, [addAssistantMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleAnswer = useCallback(
    (value: unknown, displayValue?: string) => {
      // Use refs to get current values (avoids stale closures)
      const nodeId = currentNodeIdRef.current;
      const data = assessmentDataRef.current;
      const node = getNode(nodeId);
      if (!node) return;

      // Add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: displayValue || String(value),
      };
      setMessages((prev) => {
        const updated = prev.map((m) =>
          m.id === `assistant-${node.id}` ? { ...m, answered: true } : m
        );
        return [...updated, userMsg];
      });

      // Store data
      const newData = { ...data, [node.storeAs]: value };
      setAssessmentData(newData);
      assessmentDataRef.current = newData;

      // Calculate progress
      const answeredCount = Object.keys(newData).length;
      setProgress(Math.min(100, Math.round((answeredCount / totalNodes) * 100)));

      // Navigate to next
      const nextId = getNextNodeId(node, value);
      if (nextId === "DONE") {
        onComplete(newData);
        return;
      }

      setCurrentNodeId(nextId);
      currentNodeIdRef.current = nextId;
      const nextNode = getNode(nextId);
      if (nextNode) {
        addAssistantMessage(nextNode, newData);
      }

      // Reset inputs
      setTextInput("");
      setSelectedOptions([]);
    },
    [totalNodes, onComplete, addAssistantMessage]
  );

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    const node = getNode(currentNodeId);
    if (node?.inputConfig?.unit === "$") {
      handleAnswer(Number(textInput.replace(/,/g, "")), `$${Number(textInput.replace(/,/g, "")).toLocaleString()}`);
    } else if (node?.inputType === "number") {
      handleAnswer(Number(textInput), textInput);
    } else {
      handleAnswer(textInput);
    }
  };

  const handleMultiSelectConfirm = () => {
    if (selectedOptions.length === 0) return;
    const node = getNode(currentNodeId);
    const labels = selectedOptions
      .map((v) => node?.options?.find((o) => o.value === v)?.label || v)
      .join(", ");
    handleAnswer(selectedOptions, labels);
  };

  const currentNode = getNode(currentNodeId);
  const lastMessage = messages[messages.length - 1];
  const showInput = lastMessage?.role === "assistant" && !lastMessage.answered;

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            {currentNode?.category?.replace("-", " ") || "Assessment"}
          </span>
          <span className="text-xs text-slate-500">{progress}% complete</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-emerald rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 ${
                  msg.role === "user"
                    ? "bg-accent text-white rounded-br-md"
                    : "glass rounded-bl-md"
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass rounded-2xl rounded-bl-md px-5 py-3.5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {showInput && currentNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 border-t border-white/5 p-4"
        >
          {/* SELECT OPTIONS */}
          {currentNode.inputType === "select" && currentNode.options && (
            <div className="space-y-2">
              {currentNode.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.value, opt.label)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass hover:bg-surface-light transition-all duration-200 group text-left"
                >
                  <div>
                    <span className="text-sm text-white font-medium">{opt.label}</span>
                    {opt.description && (
                      <span className="block text-xs text-slate-500 mt-0.5">{opt.description}</span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-accent-light transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* MULTI-SELECT OPTIONS */}
          {currentNode.inputType === "multi-select" && currentNode.options && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {currentNode.options.map((opt) => {
                  const isSelected = selectedOptions.includes(String(opt.value));
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedOptions((prev) =>
                          isSelected
                            ? prev.filter((v) => v !== String(opt.value))
                            : prev.length < 5
                            ? [...prev, String(opt.value)]
                            : prev
                        );
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-accent/20 border border-accent/40 text-accent-light"
                          : "glass hover:bg-surface-light text-slate-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-accent border-accent" : "border-slate-600"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleMultiSelectConfirm}
                disabled={selectedOptions.length === 0}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-light transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SLIDER */}
          {currentNode.inputType === "slider" && currentNode.inputConfig && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {currentNode.inputConfig.min}
                  {currentNode.inputConfig.unit}
                </span>
                <span className="text-3xl font-bold text-white">
                  {sliderValue}
                  {currentNode.inputConfig.unit}
                </span>
                <span className="text-sm text-slate-500">
                  {currentNode.inputConfig.max}
                  {currentNode.inputConfig.unit}
                </span>
              </div>
              <input
                type="range"
                min={currentNode.inputConfig.min}
                max={currentNode.inputConfig.max}
                step={currentNode.inputConfig.step || 1}
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer accent-accent"
              />
              <button
                onClick={() => handleAnswer(sliderValue, `${sliderValue}${currentNode.inputConfig?.unit || ""}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-white font-medium hover:bg-accent-light transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TEXT / NUMBER INPUT */}
          {(currentNode.inputType === "text" || currentNode.inputType === "number") && (
            <div className="flex gap-2">
              {currentNode.inputConfig?.unit === "$" && (
                <span className="flex items-center px-3 text-slate-500 text-lg font-medium">$</span>
              )}
              <input
                ref={inputRef}
                type={currentNode.inputType === "number" ? "number" : "text"}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                placeholder={currentNode.inputConfig?.placeholder || "Type your answer..."}
                min={currentNode.inputConfig?.min}
                max={currentNode.inputConfig?.max}
                className="flex-1 bg-surface rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                autoFocus
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="px-4 py-3 rounded-xl bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent-light transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
