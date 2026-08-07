#!/usr/bin/env python3
"""Export an iMessage conversation with Carrington Smurl to the Desktop."""

import sqlite3
import os
from datetime import datetime, timedelta

CONTACT_NAME = "Carrington Smurl"
DB_PATH = os.path.expanduser("~/Library/Messages/chat.db")
OUTPUT_PATH = os.path.expanduser(f"~/Desktop/iMessage - {CONTACT_NAME}.txt")

# iMessage stores dates as nanoseconds since 2001-01-01
APPLE_EPOCH = datetime(2001, 1, 1)


def convert_apple_timestamp(ts):
    if ts is None or ts == 0:
        return None
    try:
        if ts > 1e15:
            seconds = ts / 1e9
        elif ts > 1e12:
            seconds = ts / 1e6
        else:
            seconds = ts
        return APPLE_EPOCH + timedelta(seconds=seconds)
    except (OverflowError, OSError):
        return None


def find_chat_ids(cursor, contact_name):
    name_lower = contact_name.lower()

    cursor.execute("""
        SELECT DISTINCT c.ROWID, c.chat_identifier, c.display_name
        FROM chat c
        LEFT JOIN chat_handle_join chj ON c.ROWID = chj.chat_id
        LEFT JOIN handle h ON chj.handle_id = h.ROWID
        WHERE LOWER(c.display_name) LIKE ?
    """, (f"%{name_lower}%",))
    results = cursor.fetchall()

    if not results:
        cursor.execute("""
            SELECT DISTINCT c.ROWID, c.chat_identifier, c.display_name
            FROM chat c
            LEFT JOIN chat_handle_join chj ON c.ROWID = chj.chat_id
            LEFT JOIN handle h ON chj.handle_id = h.ROWID
            WHERE LOWER(h.id) LIKE ?
               OR LOWER(c.chat_identifier) LIKE ?
        """, (f"%{name_lower}%", f"%{name_lower}%"))
        results = cursor.fetchall()

    return results


def export_messages(cursor, chat_ids, contact_name):
    if not chat_ids:
        return []

    placeholders = ",".join("?" * len(chat_ids))
    cursor.execute(f"""
        SELECT
            m.date,
            m.is_from_me,
            m.text,
            h.id as handle_id
        FROM message m
        JOIN chat_message_join cmj ON m.ROWID = cmj.message_id
        LEFT JOIN handle h ON m.handle_id = h.ROWID
        WHERE cmj.chat_id IN ({placeholders})
        ORDER BY m.date ASC
    """, chat_ids)

    messages = []
    for date_val, is_from_me, text, handle_id in cursor.fetchall():
        if text is None or text.strip() == "":
            continue
        dt = convert_apple_timestamp(date_val)
        timestamp = dt.strftime("%Y-%m-%d %H:%M:%S") if dt else "Unknown date"
        sender = "Me" if is_from_me else contact_name
        messages.append(f"[{timestamp}] {sender}: {text}")

    return messages


def main():
    if not os.path.exists(DB_PATH):
        print(f"iMessage database not found at {DB_PATH}")
        print("Make sure you're running this on a Mac with iMessage.")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
    except sqlite3.OperationalError:
        print("Cannot open iMessage database.")
        print("Go to System Settings > Privacy & Security > Full Disk Access")
        print("and enable access for Terminal (or your terminal app).")
        return

    cursor = conn.cursor()
    chats = find_chat_ids(cursor, CONTACT_NAME)

    if not chats:
        print(f"No conversation found with \"{CONTACT_NAME}\".")
        print("Check that the name matches exactly as it appears in iMessage.")
        conn.close()
        return

    chat_ids = [row[0] for row in chats]
    messages = export_messages(cursor, chat_ids, CONTACT_NAME)
    conn.close()

    if not messages:
        print(f"No messages found in conversation with {CONTACT_NAME}.")
        return

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(f"iMessage Conversation with {CONTACT_NAME}\n")
        f.write(f"Exported on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total messages: {len(messages)}\n")
        f.write("=" * 60 + "\n\n")
        f.write("\n".join(messages))
        f.write("\n")

    print(f"Exported {len(messages)} messages to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
