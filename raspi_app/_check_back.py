import os, re

for f in sorted(os.listdir('ui')):
    if not f.endswith('.ui'): continue
    content = open(os.path.join('ui', f), encoding='utf-8').read()
    # Find btnBack or btnBackMain
    for name in ['btnBack','btnBackMain']:
        idx = content.find(f'name="{name}"')
        if idx == -1: continue
        text_start = content.find('<string>', idx)
        text_end = content.find('</string>', text_start)
        text = content[text_start+8:text_end]
        print(f'{f:25s} {name:15s} {repr(text)}')
