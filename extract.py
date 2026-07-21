import json
msgs = []
with open(r'C:\Users\biswa\.gemini\antigravity\brain\928c6dc7-e755-4c1b-844d-0ce32f328766\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        try:
            msgs.append(json.loads(line))
        except:
            pass
last = [m for m in msgs if m.get('type') == 'USER_INPUT'][-1]['content']
with open('last_user_msg.txt', 'w', encoding='utf-8') as f:
    f.write(last)
