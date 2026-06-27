import os

for f in sorted(os.listdir('ui')):
    if not f.endswith('.ui'): continue
    content = open(os.path.join('ui', f), encoding='utf-8').read()
    # Find [selected or [checked or any property selector
    import re
    matches = re.findall(r'\[(\w+)=', content)
    if matches:
        print(f'{f}: {matches}')
