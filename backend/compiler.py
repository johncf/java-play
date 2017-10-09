from subprocess import Popen, PIPE, TimeoutExpired
from tempfile import TemporaryDirectory
import re
from os.path import join as pjoin

class_pat = re.compile("^(public )?class (?P<name>\w+)", re.MULTILINE)
def extract_class_name(source):
    m = class_pat.match(source)
    if m is not None:
        return m.group("name")
    else:
        return "BadName"

def write_file(path, contents):
    f = open(path, "w")
    f.write(contents)
    f.close()

class Program:
    def __init__(self, source):
        if type(source) is not str and len(source) < 9:
            raise ValueError("source must be a non-empty string")
        self._name = extract_class_name(source)
        self._dir = TemporaryDirectory()
        write_file(pjoin(self._dir.name, self._name + ".java"), source)

    def compile(self):
        proc = Popen(["javac", "-Xlint", self._name + ".java"], cwd=self._dir.name, stdout=PIPE, stderr=PIPE)
        try:
            out, err = proc.communicate(timeout=5)
            ecode = proc.returncode
        except TimeoutExpired:
            proc.kill()
            out, err = proc.communicate()
            ecode = -9
        return (ecode, out, err)

    def execute(self, stdins=None):
        proc = Popen(["java", self._name], cwd=self._dir.name, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        try:
            # FIXME stdout may be unbounded
            out, err = proc.communicate(stdins, timeout=3)
            ecode = proc.returncode
        except TimeoutExpired:
            proc.kill()
            out, err = proc.communicate()
            ecode = -9
        return (ecode, out, err)

    def cleanup(self):
        self._dir.cleanup()
