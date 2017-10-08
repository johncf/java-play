#!env python3

import nnpy
import compiler
import json

s = nnpy.Socket(nnpy.AF_SP, nnpy.PAIR)
port = '8082'
s.bind('tcp://0.0.0.0:' + port)
print('Listening on ' + port)

p = None
while True:
    if p is not None:
        p.cleanup()
    msg = json.loads(s.recv().decode('utf-8'))
    if 'source' not in msg:
        s.send(json.dumps({'status': 'error'}))
        continue
    p = compiler.Program(msg['source'])
    s.send(json.dumps({'status': 'started'}))
    output = ""
    ecode, out, err = p.compile()
    s.send(json.dumps({
        'status': 'compiled',
        'log': (out + err).decode('utf-8'),
        'ecode': ecode
    }))
    if ecode != 0:
        s.send(output)
        continue
    if 'stdin' in msg:
        ecode, out, err = p.execute(stdins=msg['stdin'])
    else:
        ecode, out, err = p.execute()
    s.send(json.dumps({
        'status': 'executed',
        'out': out.decode('utf-8'),
        'err': err.decode('utf-8'),
        'ecode': ecode
    }))
