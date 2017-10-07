#!env python3

import nnpy
import compiler

s = nnpy.Socket(nnpy.AF_SP, nnpy.PAIR)
s.bind('tcp://0.0.0.0:8082')
p = None
while True:
    if p is not None:
        p.cleanup()
    p = compiler.Program(s.recv().decode("utf-8"))
    output = ""
    ecode, out, err = p.compile()
    output += "Compiler exited with code " + str(ecode) + "\n"
    output += (out + err).decode("utf-8")
    output += "\n"
    if ecode != 0:
        s.send(output)
        continue
    ecode, out, err = p.run()
    output += "Program exited with code " + str(ecode) + "\n"
    output += (out + err).decode("utf-8")
    output += "\n"
    s.send(output)
