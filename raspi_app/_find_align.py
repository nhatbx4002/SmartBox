import os

for f in sorted(os.listdir('ui')):
    if not f.endswith('.ui'): continue
    content = open(os.path.join('ui', f), encoding='utf-8').read()
    if 'qproperty-alignment' in content:
        print(f'{f}: qproperty-alignment')
    if '<property name="alignment">' in content:
        print(f'{f}: alignment property')
