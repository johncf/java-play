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
    if 'seqnum' not in msg or 'source' not in msg:
        s.send(json.dumps({'status': 'error', 'cause': 'bad request', 'done': True}))
        print("Got a bad request.")
        continue
    print("Got a compilation request.")
    seqnum = msg['seqnum']

    s.send(json.dumps({
        'seqnum': seqnum,
        'status': 'started',
        'done': False
    }))

    p = compiler.Program(msg['source'])
    ecode, out, err = p.compile()
    s.send(json.dumps({
        'seqnum': seqnum,
        'status': 'compiled',
        'log': (out + err).decode('utf-8'),
        'ecode': ecode,
        'done': ecode != 0
    }))

    if ecode != 0:
        continue

    if 'stdin' in msg:
        ecode, out, err = p.execute(stdins=msg['stdin'])
    else:
        ecode, out, err = p.execute()
    s.send(json.dumps({
        'seqnum': seqnum,
        'status': 'executed',
        'out': out.decode('utf-8'),
        'err': err.decode('utf-8'),
        'ecode': ecode,
        'done': True
    }))
