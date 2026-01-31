# Mini Shell (Node.js)

A minimal Unix-like shell written in Node.js.

This project was built as a learning exercise, guided by the
CodeCrafters “Build Your Own Shell” challenge.  
It is not a copy-paste tutorial project — the goal was to understand
how shells work internally and implement core behavior step by step.

---

## Features

- Interactive shell prompt
- Built-in commands:
  - `echo`
  - `cd`
  - `pwd`
  - `ls`
  - `type`
  - `exit`
- External command execution via `$PATH`
- Executable detection and basic error handling
- Maintains shell working directory across commands

---

The project will be improved over time with:
- additional commands
- bug fixes
- better argument handling
- missing shell features

---

## Running the shell

```bash
node main.js
