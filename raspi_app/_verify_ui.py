import os, xml.etree.ElementTree as ET

for f in sorted(os.listdir('ui')):
    if not f.endswith('.ui'): continue
    try:
        ET.parse(os.path.join('ui', f))
        print(f'{f}: OK')
    except ET.ParseError as e:
        print(f'{f}: {e}')
        # Show the problematic lines
        lines = open(os.path.join('ui', f), encoding='utf-8').readlines()
        line_no = int(str(e).split('line ')[1].split(',')[0])
        for i in range(max(0,line_no-3), min(len(lines),line_no+2)):
            mark = '>>>' if i == line_no-1 else '   '
            print(f'{mark} {i+1}: {lines[i].rstrip()}')
        print()
