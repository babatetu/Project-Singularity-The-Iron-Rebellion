import { CodeVaultEntry, HintData } from '../types';

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "Which line correctly prints 'Hello'?",
    options: [
      { id: 'a', text: "print(Hello)", correct: false },
      { id: 'b', text: "print('Hello')", correct: true },
      { id: 'c', text: "echo 'Hello'", correct: false }
    ]
  },
  {
    id: 2,
    question: "How do you store the number 5 in a variable 'x'?",
    options: [
      { id: 'a', text: "x = 5", correct: true },
      { id: 'b', text: "int x = 5", correct: false },
      { id: 'c', text: "5 -> x", correct: false }
    ]
  },
  {
    id: 3,
    question: "What is the output of: print(10 + 2)",
    options: [
      { id: 'a', text: "102", correct: false },
      { id: 'b', text: "10 + 2", correct: false },
      { id: 'c', text: "12", correct: true }
    ]
  }
];

export const HINTS_DATABASE: Record<number, HintData> = {
  1: { tier1: "Use print()", tier2: "print(\"Text\")", tier3: "print(\"SYSTEM ONLINE\")", tier4: "Solution: print(\"SYSTEM ONLINE\")" },
  2: { tier1: "energy = value", tier2: "energy = 100", tier3: "print(energy)", tier4: "Solution:\nenergy = 100\nprint(energy)" },
  3: { tier1: "Use math ops", tier2: "50 * 2 - 10", tier3: "print(50 * 2 - 10)", tier4: "Solution: print(50 * 2 - 10)" },
  4: { tier1: "Combine strings", tier2: "part1 + part2", tier3: "full_key = part1 + part2", tier4: "Solution:\npart1=\"ACCESS\"\npart2=\"_GRANTED\"\nfull_key=part1+part2\nprint(full_key)" },
  5: { tier1: "Use if statement", tier2: "if status == \"admin\":", tier3: "Indent the print", tier4: "Solution:\nstatus=\"admin\"\nif status==\"admin\":\n    print(\"OPEN\")" },
  6: { tier1: "Use for loop", tier2: "for i in range(5):", tier3: "Indent print", tier4: "Solution:\nfor i in range(5):\n    print(\"OVERLOAD\")" },
  7: { tier1: "Use while loop", tier2: "while signal < 4:", tier3: "Increment signal inside", tier4: "Solution:\nsignal=1\nwhile signal<4:\n    print(\"Scanning\")\n    signal+=1" },
  8: { tier1: "Modulo % operator", tier2: "if i % 2 == 0:", tier3: "Inside loop range(6)", tier4: "Solution:\nfor i in range(6):\n    if i%2==0:\n        print(\"Secure\")" },
  9: { tier1: "While t > 0", tier2: "Decrement t = t - 1", tier3: "Print Liftoff after loop", tier4: "Solution:\nt=5\nwhile t>0:\n    print(t)\n    t-=1\nprint(\"Liftoff\")" },
  10: { tier1: "Use [] for lists", tier2: "targets = [\"A\", \"B\"]", tier3: "Add all 3 items", tier4: "Solution:\ntargets=[\"Drone\",\"Turret\",\"Wall\"]\nprint(targets)" },
  11: { tier1: "Use index [0]", tier2: "codes[0]", tier3: "print(codes[0])", tier4: "Solution: print(codes[0])" },
  12: { tier1: "for item in list", tier2: "for f in files:", tier3: "print(f)", tier4: "Solution:\nfor f in files:\n    print(f)" },
  13: { tier1: "Slice [start:end]", tier2: "msg[6:10]", tier3: "print result", tier4: "Solution: print(msg[6:10])" },
  14: { tier1: "Dict uses {}", tier2: "user = {\"name\": \"Cipher\", ...}", tier3: "user[\"name\"]", tier4: "Solution:\nuser={\"name\":\"Cipher\",\"rank\":1}\nprint(user[\"name\"])" },
  15: { tier1: "def name():", tier2: "def heal():", tier3: "Call heal() at end", tier4: "Solution:\ndef heal():\n    print(\"Shields Restored\")\nheal()" },
  16: { tier1: "Use return", tier2: "return \"Ready\"", tier3: "print(get_status())", tier4: "Solution:\ndef get_status():\n    return \"Ready\"\nprint(get_status())" },
  17: { tier1: "def charge(volts):", tier2: "print(volts)", tier3: "charge(50)", tier4: "Solution:\ndef charge(volts):\n    print(volts)\ncharge(50)" },
  18: { tier1: "Loop range(3)", tier2: "if i == 1:", tier3: "else:", tier4: "Solution:\nfor i in range(3):\n    if i==1:\n        print(\"ONE\")\n    else:\n        print(\"NOT\")" },
  19: { tier1: "Loop data", tier2: "if item == 20:", tier3: "break", tier4: "Solution:\nfor x in data:\n    if x==20:\n        print(\"FOUND\")\n        break" },
  20: { tier1: "Loop range(5)", tier2: "if i < 3", tier3: "else print FIRE", tier4: "Solution:\nfor i in range(5):\n    if i<3:\n        print(\"CHARGE\")\n    else:\n        print(\"FIRE\")" },
  21: { tier1: "Multiple assignment", tier2: "x, y = y, x", tier3: "print(x); print(y)", tier4: "Solution:\nx, y = y, x\nprint(x)\nprint(y)" },
  22: { tier1: ".replace()", tier2: "msg.replace(\"WIN\", \"FAIL\")", tier3: "Print the result", tier4: "Solution: print(msg.replace(\"WIN\", \"FAIL\"))" },
  23: { tier1: ".append()", tier2: "inventory.append(\"Ammo\")", tier3: "Print inventory", tier4: "Solution:\ninventory.append(\"Ammo\")\nprint(inventory)" },
  24: { tier1: "Nested for loops", tier2: "for i in... for j in...", tier3: "print(i, j)", tier4: "Solution:\nfor i in range(3):\n    for j in range(3):\n        print(i, j)" },
  25: { tier1: "dict[key] = value", tier2: "config[\"power\"] = 100", tier3: "print(config)", tier4: "Solution:\nconfig[\"power\"] = 100\nprint(config)" },
  26: { tier1: "while condition", tier2: "while password != \"secret\"", tier3: "update password", tier4: "Solution:\nwhile password!=\"secret\":\n  print(\"Access Denied\")\n  password=\"secret\"" },
  27: { tier1: "def name(a, b)", tier2: "print(x+y)", tier3: "target(10, 20)", tier4: "Solution:\ndef target(x,y):\n  print(x+y)\ntarget(10,20)" },
  28: { tier1: "return Boolean", tier2: "if x > 10 return True", tier3: "else return False", tier4: "Solution:\ndef check(x):\n  return x>10\nprint(check(15))" },
  29: { tier1: "f\"string\"", tier2: "f\"Level {level}\"", tier3: "print f-string", tier4: "Solution: print(f\"Status: Level {level}\")" },
  30: { tier1: "Recursion", tier2: "Call purge(n-1)", tier3: "Check n <= 0", tier4: "Solution:\ndef purge(n):\n  if n<=0: return\n  print(n)\n  purge(n-1)\npurge(3)" },
  31: { tier1: "import module", tier2: "import random", tier3: "random.randint", tier4: "Solution:\nimport random\nprint(random.randint(1,100))" },
  32: { tier1: "try...except", tier2: "except:", tier3: "print('Caught')", tier4: "Solution:\ntry:\n  print(1/0)\nexcept:\n  print(\"Caught\")" },
  33: { tier1: "class Name", tier2: "class Bot:", tier3: "b = Bot()", tier4: "Solution:\nclass Bot:\n  pass\nb=Bot()\nprint(b)" },
  34: { tier1: "Method(self)", tier2: "def scan(self):", tier3: "b.scan()", tier4: "Solution:\nclass Bot:\n  def scan(self):\n    print(\"Scanning\")\nb=Bot()\nb.scan()" },
  35: { tier1: "in operator", tier2: "if 5 in ids:", tier3: "print Found", tier4: "Solution:\nif 5 in ids:\n  print(\"Found\")" },
  36: { tier1: ".sort()", tier2: "nums.sort()", tier3: "print nums", tier4: "Solution:\nnums.sort()\nprint(nums)" },
  37: { tier1: "open(file, mode)", tier2: "mode 'w'", tier3: "f.write()", tier4: "Solution:\nf=open(\"log.txt\",\"w\")\nf.write(\"Entry\")\nf.close()" },
  38: { tier1: "mode 'r'", tier2: "f.read()", tier3: "print content", tier4: "Solution:\nf=open(\"plan.txt\",\"r\")\nd=f.read()\nprint(d)" },
  39: { tier1: "lambda", tier2: "lambda x: x*2", tier3: "double(5)", tier4: "Solution:\ndouble=lambda x:x*2\nprint(double(5))" },
  40: { tier1: "Modulo 3", tier2: "i % 3 == 0", tier3: "Patch vs Scan", tier4: "Solution:\nfor i in range(10):\n  if i%3==0: print(\"Patch\")\n  else: print(\"Scan\")" },
  41: { tier1: "Print", tier2: "Print it", tier3: "Just print it", tier4: "Solution: print(\"Singularity Achieved\")" }
};

export const CODE_VAULT: CodeVaultEntry[] = [
  { id: 'basics_print', title: 'Print', code: 'print("Hello")', description: 'Output text.', unlockedAtLevel: 1 },
  { id: 'basics_vars', title: 'Variables', code: 'x = 10', description: 'Store data.', unlockedAtLevel: 2 },
  { id: 'basics_math', title: 'Math', code: '10 + 5', description: 'Arithmetic ops.', unlockedAtLevel: 3 },
  { id: 'basics_str', title: 'Strings', code: '"A"+"B"', description: 'Concatenation.', unlockedAtLevel: 4 },
  { id: 'basics_if', title: 'If Statement', code: 'if x > 5:\n  print("Yes")', description: 'Conditions.', unlockedAtLevel: 5 },
  { id: 'basics_else', title: 'If/Else', code: 'if x:\n  do_a()\nelse:\n  do_b()', description: 'Alternate paths.', unlockedAtLevel: 5 },
  { id: 'basics_for', title: 'For Loop', code: 'for i in range(5):', description: 'Iteration.', unlockedAtLevel: 6 },
  { id: 'basics_while', title: 'While Loop', code: 'while x < 5:', description: 'Loop until condition false.', unlockedAtLevel: 7 },
  { id: 'basics_list', title: 'Lists', code: 'items = [1, 2]', description: 'Store multiple items.', unlockedAtLevel: 10 },
  { id: 'list_append', title: 'List Append', code: 'items.append(3)', description: 'Add item to list.', unlockedAtLevel: 10 },
  { id: 'basics_slice', title: 'Slicing', code: 's[0:3]', description: 'Extract sub-string.', unlockedAtLevel: 13 },
  { id: 'str_len', title: 'Length', code: 'len(s)', description: 'Get length.', unlockedAtLevel: 13 },
  { id: 'basics_dict', title: 'Dictionary', code: 'd = {"k": "v"}', description: 'Key-Value pairs.', unlockedAtLevel: 14 },
  { id: 'basics_func', title: 'Define Function', code: 'def f():\n  return 1', description: 'Reusable code blocks.', unlockedAtLevel: 15 },
  { id: 'func_call', title: 'Call Function', code: 'f()', description: 'Execute a function.', unlockedAtLevel: 15 },
  { id: 'basics_break', title: 'Break', code: 'break', description: 'Exit loop immediately.', unlockedAtLevel: 19 },
  
  // NEW ENTRIES
  { id: 'str_replace', title: 'String Replace', code: 's.replace("old", "new")', description: 'Substitute text.', unlockedAtLevel: 22 },
  { id: 'list_append_method', title: 'Append', code: 'list.append(item)', description: 'Add to end of list.', unlockedAtLevel: 23 },
  { id: 'dict_update', title: 'Dict Update', code: 'd["key"] = val', description: 'Change dictionary value.', unlockedAtLevel: 25 },
  { id: 'func_args', title: 'Function Args', code: 'def f(x, y):', description: 'Multiple parameters.', unlockedAtLevel: 27 },
  { id: 'f_string', title: 'F-String', code: 'f"Value: {x}"', description: 'Formatted strings.', unlockedAtLevel: 29 },
  { id: 'recursion', title: 'Recursion', code: 'def f(n):\n f(n-1)', description: 'Function calling itself.', unlockedAtLevel: 30 },
  { id: 'modules', title: 'Import', code: 'import math', description: 'Use external libraries.', unlockedAtLevel: 31 },
  { id: 'exceptions', title: 'Try/Except', code: 'try:\n 1/0\nexcept:\n pass', description: 'Handle errors.', unlockedAtLevel: 32 },
  { id: 'classes', title: 'Class', code: 'class Dog:\n pass', description: 'Define Object Blueprint.', unlockedAtLevel: 33 },
  { id: 'methods', title: 'Method', code: 'def bark(self):', description: 'Function inside class.', unlockedAtLevel: 34 },
  { id: 'sorting', title: 'Sort', code: 'list.sort()', description: 'Order list items.', unlockedAtLevel: 36 },
  { id: 'file_io', title: 'File Write', code: 'open("f.txt", "w")', description: 'Write to file.', unlockedAtLevel: 37 },
  { id: 'file_read', title: 'File Read', code: 'f.read()', description: 'Read file content.', unlockedAtLevel: 38 },
  { id: 'lambda', title: 'Lambda', code: 'lambda x: x*2', description: 'Anonymous function.', unlockedAtLevel: 39 }
];