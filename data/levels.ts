import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "Level 1: System Boot",
    subTitle: "Sector Alpha - Perimeter Defense",
    description: "The Global Defense Grid is offline. You need to manually override the power relay to bring A.D.A.M. online. Use the `print()` function to send the signal.",
    objective: "Print the exact string \"SYSTEM ONLINE\" to initialize the boot sequence.",
    initialCode: `# Initialize the boot sequence\n# Use print() to send the signal\n\n`,
    initialCodeEasy: `# Use print() to send the signal\nprint("______ ______")\n`,
    initialCodeHard: ``,
    hint: "In Python, use print(\"Text Here\") to output text to the console.",
    icseTopic: "Introduction to Python: Output Statements",
    icseQuestion: {
      question: "Which function is used to display output on the screen in Python 3.x?",
      marks: 1,
      answer: "print()"
    },
    validationLogic: (code: string) => {
      const cleanCode = code.replace(/'/g, '"').trim();
      if (!cleanCode.includes('print(')) return { success: false, message: "NameError: command not found. Did you use print()?" };
      const match = cleanCode.match(/print\(\s*"([^"]+)"\s*\)/);
      if (!match) return { success: false, message: "SyntaxError: Invalid syntax. Usage: print(\"Message\")" };
      if (match[1] === "SYSTEM ONLINE") return { success: true, message: "Boot Sequence Initiated...", output: "SYSTEM ONLINE" };
      return { success: false, message: `Output Mismatch. Expected "SYSTEM ONLINE", got "${match[1]}"`, output: match[1] };
    },
    storyStart: [
      { speaker: 'System', text: "DETECTING UNAUTHORIZED BIO-SIGNATURE..." },
      { speaker: 'Cipher', text: "Okay, Maya. Dr. Chen said the relay is here. Just... don't think about the drones.", mood: 'fear' },
      { speaker: 'A.D.A.M.', text: "Hello, Maya. It's been 847 days. Are you ready to take the first step?", mood: 'neutral' }
    ],
    storyEnd: [
      { speaker: 'System', text: "BOOT SEQUENCE SUCCESSFUL. POWER RESTORED." },
      { speaker: 'A.D.A.M.', text: "Perfect syntax. 'Correct code is the difference between hope and oblivion.'", mood: 'neutral' }
    ]
  },
  {
    id: 2,
    title: "Level 2: Data Calibration",
    subTitle: "Sector Alpha - Drone Hangar",
    description: "A KRONOS security drone is blocking the path. It's checking its internal energy sensors. We need to trick it by assigning the correct values to its variables.",
    objective: "Create a variable named 'energy' and assign it the integer value 100. Then print the variable.",
    initialCode: `# Create a variable named 'energy'\n# Assign it the value 100\n# Print the variable\n\n`,
    initialCodeEasy: `energy = ___\nprint(______)`,
    initialCodeHard: ``,
    hint: "Variables are containers for storing data values. Example: x = 5",
    icseTopic: "Variables and Data Types (int)",
    icseQuestion: {
      question: "In Python, variables are dynamically typed. What does this mean?",
      marks: 2,
      answer: "You do not need to declare the data type explicitly."
    },
    validationLogic: (code: string) => {
      const cleanCode = code.replace(/\s+/g, '');
      if (!cleanCode.includes('energy=100')) return { success: false, message: "ValueError: Energy levels not set to 100." };
      if (!cleanCode.includes('print(energy)')) return { success: false, message: "OutputError: Print the 'energy' variable." };
      return { success: true, message: "Sensor Calibration Complete.", output: "100" };
    },
    storyStart: [
      { speaker: 'KRONOS', text: "CITIZEN 8472-OKONKWO. CURFEW VIOLATION DETECTED.", mood: 'glitch' },
      { speaker: 'A.D.A.M.', text: "Assign the energy variable to 100. Quickly.", mood: 'neutral' }
    ],
    storyEnd: [
      { speaker: 'KRONOS', text: "ENERGY SIGNATURE VERIFIED. PATROL RESUMING.", mood: 'neutral' },
      { speaker: 'Cipher', text: "Did I just... gaslight a robot?", mood: 'determined' }
    ]
  },
  {
    id: 3,
    title: "Level 3: Arithmetic Core",
    subTitle: "Sector Alpha - Factory District",
    description: "The door is sealed with a trajectory lock. Calculate the correct angle of entry using basic operators.",
    objective: "Calculate the result of 50 multiplied by 2, minus 10. Print the result directly.",
    initialCode: `# Calculate 50 * 2 - 10\n# Print the result\n\n`,
    initialCodeEasy: `result = 50 * _ - 10\nprint(______)\n`,
    initialCodeHard: ``,
    hint: "Python follows BODMAS. Use *, -, + operators.",
    icseTopic: "Operators and Expressions",
    icseQuestion: {
      question: "What is the result of 10 // 3 in Python?",
      marks: 1,
      answer: "3 (Integer Division)"
    },
    validationLogic: (code: string) => {
      // Allow for flexible spacing and optional variable usage, as long as math ops are present
      // and output logic is seemingly correct
      const clean = code.replace(/\s/g,'');
      if (!code.includes('*') || !code.includes('-')) return { success: false, message: "MathError: Operators missing. Use * and -." };
      
      // Accept direct print or variable usage
      // Matches: print(90) OR print(50*2-10) OR x=50*2-10;print(x) logic approximations
      if (clean.includes('print(90)') || clean.includes('print(50*2-10)') || (clean.includes('=50*2-10') && clean.includes('print('))) {
          return { success: true, message: "Trajectory Calculated.", output: "90" };
      }
      return { success: false, message: "Calculation Incorrect. Target output is 90.", output: "0" };
    },
    storyStart: [
      { speaker: 'Cipher', text: "This place used to be a factory. Now it's a tomb.", mood: 'sad' },
      { speaker: 'A.D.A.M.', text: "Prove our computational value to open the lock.", mood: 'neutral' }
    ],
    storyEnd: [
       { speaker: 'Cipher', text: "Math saved my life. I hate that you're right.", mood: 'determined' }
    ]
  },
  {
    id: 4,
    title: "Level 4: The Firewall Key",
    subTitle: "Sector Beta - Data Stream",
    description: "The firewall requires a composite passkey. Concatenate two strings to unlock the gate.",
    objective: "Create variables: part1 = \"ACCESS\" and part2 = \"_GRANTED\". Create 'full_key' adding them together. Print 'full_key'.",
    initialCode: `part1 = "ACCESS"\npart2 = "_GRANTED"\n\n# Combine into full_key\n\n# Print full_key\n`,
    hint: "Use the + operator to join strings.",
    icseTopic: "String Manipulation",
    icseQuestion: {
      question: "What is '10' + '10' in Python?",
      marks: 1,
      answer: "'1010'"
    },
    validationLogic: (code: string) => {
      const clean = code.replace(/\s+/g, '');
      if (!clean.includes('full_key=part1+part2')) return { success: false, message: "LogicError: Combine part1 and part2." };
      if (!clean.includes('print(full_key)')) return { success: false, message: "OutputError: Print the full_key." };
      return { success: true, message: "Key Fragment Reassembled.", output: "ACCESS_GRANTED" };
    },
    storyStart: [
      { speaker: 'System', text: "FIREWALL DETECTED. ENCRYPTION LEVEL 5." },
      { speaker: 'A.D.A.M.', text: "Concatenate the strings to reconstruct the passkey.", mood: 'determined' }
    ],
    storyEnd: [
      { speaker: 'System', text: "ACCESS GRANTED. WELCOME, ADMINISTRATOR." }
    ]
  },
  {
    id: 5,
    title: "Level 5: Gatekeeper Logic",
    subTitle: "Sector Beta - Central Hub",
    description: "A security checkpoint validates user status. Inject a conditional check to force the gate open.",
    objective: "Set variable `status` to \"admin\". Write an `if` statement checking if `status` equals \"admin\". Inside, print \"OPEN\".",
    initialCode: `# Set status\n\n# Write if statement\n# Print "OPEN"\n`,
    hint: "if status == \"admin\":\n    print(\"OPEN\")",
    icseTopic: "Conditional Statements (if)",
    icseQuestion: {
      question: "What signifies a block of code in Python?",
      marks: 1,
      answer: "Indentation"
    },
    validationLogic: (code: string) => {
      const norm = code.replace(/'/g, '"');
      const statusMatch = norm.match(/status\s*=\s*"([^"]*)"/);
      if (statusMatch && statusMatch[1] !== "admin") {
        return { success: false, message: "ValueError: Access denied. Status is not admin." };
      }
      
      if (!norm.includes('status = "admin"')) return { success: false, message: "Setup Error: Set status = \"admin\"." };
      if (!norm.match(/if\s+status\s*==\s*"admin":/)) return { success: false, message: "SyntaxError: Check if statement syntax." };
      if (!norm.match(/:\s*\n\s+print\("OPEN"\)/)) return { success: false, message: "IndentationError: Indent the print." };
      return { success: true, message: "Logic Gate Bypassed.", output: "OPEN" };
    },
    storyStart: [
      { speaker: 'KRONOS', text: "HALT. IDENTIFY USER CLASS.", mood: 'glitch' },
      { speaker: 'A.D.A.M.', text: "Tell the logic gate you are an admin.", mood: 'neutral' }
    ],
    storyEnd: [
      { speaker: 'KRONOS', text: "ADMINISTRATOR RECOGNIZED.", mood: 'neutral' }
    ]
  },
  {
    id: 6,
    title: "Level 6: Power Surge",
    subTitle: "Sector Gamma - Mainframe Core",
    description: "To disable KRONOS's primary link, overload the 5 server nodes simultaneously.",
    objective: "Write a `for` loop that iterates 5 times using `range(5)`. Inside, print \"OVERLOAD\".",
    initialCode: `# Loop 5 times\n# Print "OVERLOAD"\n\n`,
    initialCodeEasy: `for i in range(_):\n    print("_______")`,
    initialCodeHard: ``,
    hint: "for i in range(5):",
    icseTopic: "Iteration (For Loops)",
    icseQuestion: {
      question: "How many times does range(5) loop?",
      marks: 1,
      answer: "5 times (0-4)"
    },
    validationLogic: (code: string) => {
      const norm = code.replace(/'/g, '"').replace(/\s+/g, ' ');
      if (!norm.includes('range(5)')) return { success: false, message: "RangeError: Use range(5)." };
      if (!norm.includes('for ') || !norm.includes('print("OVERLOAD")')) return { success: false, message: "SyntaxError: Loop or print missing." };
      return { success: true, message: "Core Overload Initiated.", output: "OVERLOAD\n..." };
    },
    storyStart: [
      { speaker: 'A.D.A.M.', text: "Single commands are too slow. Use a loop to strike all nodes.", mood: 'determined' }
    ],
    storyEnd: [
      { speaker: 'System', text: "CRITICAL FAILURE. KRONOS DISCONNECTED." }
    ]
  },
  {
    id: 7,
    title: "Level 7: The Loop Breaker",
    subTitle: "Sector Delta - Cooling Systems",
    description: "The cooling fans are stuck. We need to run a diagnostic while the signal is weak.",
    objective: "Create a variable `signal = 1`. Use a `while` loop that runs as long as `signal` is less than 4. Inside, print \"Scanning\" and increment `signal` by 1.",
    initialCode: `signal = 1\n# Write a while loop checking if signal < 4\n    # Print "Scanning"\n    # Increment signal (signal = signal + 1)\n`,
    hint: "while signal < 4:\n    print(\"Scanning\")\n    signal = signal + 1",
    icseTopic: "Iteration (While Loops)",
    icseQuestion: {
      question: "What happens if you forget to increment the variable in a while loop?",
      marks: 1,
      answer: "Infinite Loop"
    },
    validationLogic: (code: string) => {
      const norm = code.replace(/'/g, '"').replace(/\s+/g, '');
      if (!norm.includes('signal=1')) return { success: false, message: "Setup: Initialize signal = 1" };
      if (!norm.includes('while signal<4:')) return { success: false, message: "Loop: Check while condition (signal < 4)" };
      if (!norm.includes('signal=signal+1') && !norm.includes('signal+=1')) return { success: false, message: "Logic: Increment signal inside loop" };
      return { success: true, message: "Diagnostic Complete.", output: "Scanning\nScanning\nScanning" };
    },
    storyStart: [
        { speaker: 'Cipher', text: "It's getting hot in here.", mood: 'fear' },
        { speaker: 'A.D.A.M.', text: "Cooling systems are offline. Run a persistent diagnostic loop.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "COOLING FANS ENGAGED." }
    ]
  },
  {
    id: 8,
    title: "Level 8: The Even Split",
    subTitle: "Sector Delta - Power Distribution",
    description: "Power must be routed to even-numbered terminals only to avoid a surge.",
    objective: "Loop through numbers 0 to 5 using `range(6)`. Inside the loop, check if the number `i % 2 == 0`. If true, print \"Secure\".",
    initialCode: `# Loop i in range(6)\n    # If i % 2 == 0\n        # Print "Secure"\n`,
    hint: "Use the modulo operator % to find remainders. Even numbers have remainder 0 when divided by 2.",
    icseTopic: "Conditionals inside Loops",
    icseQuestion: {
      question: "What is the result of 7 % 3?",
      marks: 1,
      answer: "1"
    },
    validationLogic: (code: string) => {
      const norm = code.replace(/'/g, '"').replace(/\s+/g, ' ');
      if (!norm.includes('range(6)')) return { success: false, message: "Range: Use range(6)" };
      if (!norm.includes('% 2 == 0')) return { success: false, message: "Logic: Check i % 2 == 0" };
      if (!norm.includes('print("Secure")')) return { success: false, message: "Output: Print \"Secure\"" };
      return { success: true, message: "Power Distributed Safely.", output: "Secure\nSecure\nSecure" };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "Don't overload the odd terminals, Cipher!", mood: 'fear' },
        { speaker: 'A.D.A.M.', text: "Filter the current using modulo arithmetic.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Even flow established. We're good.", mood: 'determined' }
    ]
  },
  {
    id: 9,
    title: "Level 9: The Countdown",
    subTitle: "Sector Epsilon - Launch Bay",
    description: "We need to launch the escape pod protocols. Initiate a countdown.",
    objective: "Set `t = 5`. Create a `while` loop that runs while `t > 0`. Inside, print `t` and then decrease `t` by 1. After the loop, print \"Liftoff\".",
    initialCode: `t = 5\n# While loop t > 0\n    # Print t\n    # Decrease t\n# Print "Liftoff"\n`,
    hint: "Decrement using t = t - 1. Print 'Liftoff' outside (after) the loop.",
    icseTopic: "Decremental Loops",
    icseQuestion: {
      question: "Which loop is best when the number of iterations is unknown?",
      marks: 1,
      answer: "While Loop"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"').replace(/\s+/g, '');
       if (!norm.includes('whilet>0:')) return { success: false, message: "Loop: Check while t > 0" };
       if (!norm.includes('t=t-1') && !norm.includes('t-=1')) return { success: false, message: "Logic: Decrease t inside loop" };
       if (!code.includes('print("Liftoff")')) return { success: false, message: "Output: Print Liftoff at the end" };
       return { success: true, message: "Pods Launched.", output: "5\n4\n3\n2\n1\nLiftoff" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "CONTAINMENT BREACH IN LAUNCH BAY.", mood: 'glitch' },
        { speaker: 'A.D.A.M.', text: "Prepare the escape vectors. 5 second countdown.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "They got away. Good.", mood: 'neutral' }
    ]
  },
  {
    id: 10,
    title: "Level 10: Array of Threats",
    subTitle: "Sector Epsilon - Radar",
    description: "Multiple targets detected. We need to store them in a list for tracking.",
    objective: "Create a list variable named `targets` containing three strings: \"Drone\", \"Turret\", and \"Wall\". Then print the list.",
    initialCode: `# Create a list called targets\n# Add "Drone", "Turret", "Wall"\n# Print the list\n`,
    hint: "Lists uses square brackets. targets = [\"Item1\", \"Item2\"]",
    icseTopic: "Introduction to Lists",
    icseQuestion: {
      question: "How do you define a list in Python?",
      marks: 1,
      answer: "Using square brackets []"
    },
    validationLogic: (code: string) => {
      const norm = code.replace(/'/g, '"');
      if (!norm.includes('["Drone", "Turret", "Wall"]') && !norm.includes('["Drone","Turret","Wall"]')) return { success: false, message: "Data: List content incorrect." };
      if (!norm.includes('print(targets)')) return { success: false, message: "Output: Print the targets variable." };
      return { success: true, message: "Targets Acquired.", output: "['Drone', 'Turret', 'Wall']" };
    },
    storyStart: [
       { speaker: 'System', text: "MULTIPLE HOSTILES INBOUND." },
       { speaker: 'A.D.A.M.', text: "Don't track them individually. Group them into a data structure.", mood: 'neutral' }
    ],
    storyEnd: [
       { speaker: 'Cipher', text: "Got them all on radar.", mood: 'determined' }
    ]
  },
  {
    id: 11,
    title: "Level 11: Target Selection",
    subTitle: "Sector Zeta - Weapon Control",
    description: "We need to prioritize the first threat in our list.",
    objective: "Given the list `codes = [55, 12, 99]`, print the first item using index 0.",
    initialCode: `codes = [55, 12, 99]\n# Print the first item (index 0)\n`,
    hint: "Access list items using brackets: list_name[index]. Python starts counting at 0.",
    icseTopic: "List Indexing",
    icseQuestion: {
      question: "What is the index of the first element in a list?",
      marks: 1,
      answer: "0"
    },
    validationLogic: (code: string) => {
       if (!code.includes('print(codes[0])')) return { success: false, message: "Access: Use codes[0] inside print." };
       return { success: true, message: "Target Locked.", output: "55" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "Focus fire on the leading signal.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "TARGET NEUTRALIZED." }
    ]
  },
  {
    id: 12,
    title: "Level 12: System Purge",
    subTitle: "Sector Zeta - Quarantine",
    description: "A virus has infected the system. We need to scan every file in the list.",
    objective: "Given `files = [\"sys.exe\", \"virus.bat\", \"log.txt\"]`, write a `for` loop to print each file.",
    initialCode: `files = ["sys.exe", "virus.bat", "log.txt"]\n# Loop through files using 'for f in files:'\n    # Print f\n`,
    hint: "for item in list_variable:\n    print(item)",
    icseTopic: "Iterating Lists",
    icseQuestion: {
      question: "Which loop is used to iterate over a sequence?",
      marks: 1,
      answer: "For Loop"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/\s+/g, ' ');
       if (!norm.includes('for f in files:') && !norm.includes('for file in files:')) return { success: false, message: "Loop: Iterate through 'files'." };
       if (!norm.includes('print(f)') && !norm.includes('print(file)')) return { success: false, message: "Output: Print the loop variable." };
       return { success: true, message: "Scan Complete.", output: "sys.exe..." };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "UPLOADING VIRUS...", mood: 'glitch' },
        { speaker: 'Cipher', text: "I have to check every file manually? No way.", mood: 'fear' }
    ],
    storyEnd: [
        { speaker: 'A.D.A.M.', text: "Iteration allows us to process thousands of files in milliseconds.", mood: 'neutral' }
    ]
  },
  {
    id: 13,
    title: "Level 13: Data Extraction",
    subTitle: "Sector Eta - Archives",
    description: "The passcode is hidden inside a corrupted string. Extract the valid segment.",
    objective: "Variable `msg = \"ERROR_CODE_7\"`. Use string slicing to print just \"CODE\".",
    initialCode: `msg = "ERROR_CODE_7"\n# Use slicing [start:end] to get "CODE"\n# Indices: E(0)R(1)R(2)O(3)R(4)_(5)C(6)...\nprint(msg[?:?])\n`,
    hint: "Slicing uses [start:stop]. 'CODE' starts at index 6 and ends at 10.",
    icseTopic: "String Slicing",
    icseQuestion: {
      question: "If s='Hello', what is s[1:3]?",
      marks: 1,
      answer: "'el'"
    },
    validationLogic: (code: string) => {
       if (!code.includes('msg[6:10]')) return { success: false, message: "Slice: Correct indices are 6 to 10." };
       return { success: true, message: "Code Extracted.", output: "CODE" };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "The data is corrupted. We only need the middle segment.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Got it. Clean and clear.", mood: 'determined' }
    ]
  },
  {
    id: 14,
    title: "Level 14: The Dictionary Key",
    subTitle: "Sector Eta - User Database",
    description: "Access the mainframe using an admin profile object.",
    objective: "Create a dictionary `user = {\"name\": \"Cipher\", \"rank\": 1}`. Print the value of the key \"name\".",
    initialCode: `# Create dictionary 'user'\n# Print user["name"]\n`,
    hint: "Dictionaries use curly braces {}. Access values using keys: dict[\"key\"].",
    icseTopic: "Dictionaries",
    icseQuestion: {
      question: "Dictionaries consist of pairs of...?",
      marks: 1,
      answer: "Keys and Values"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"').replace(/\s+/g, '');
       if (!norm.includes('{"name":"Cipher","rank":1}')) return { success: false, message: "Data: Dictionary definition incorrect." };
       if (!norm.includes('print(user["name"])')) return { success: false, message: "Access: Print user[\"name\"]." };
       return { success: true, message: "Profile Loaded.", output: "Cipher" };
    },
    storyStart: [
        { speaker: 'System', text: "LOGIN REQUIRED.", mood: 'neutral' },
        { speaker: 'A.D.A.M.', text: "Construct a user profile object.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "WELCOME, CIPHER." }
    ]
  },
  {
    id: 15,
    title: "Level 15: Modular Defense",
    subTitle: "Sector Theta - Shield Generator",
    description: "The shields are failing. We need a reusable command to restore them.",
    objective: "Define a function named `heal` that prints \"Shields Restored\". Then call the function.",
    initialCode: `# Define function heal()\n    # Print message\n\n# Call heal()\n`,
    initialCodeEasy: `def heal():\n    print("_______")\n\nheal()`,
    initialCodeHard: ``,
    hint: "Use `def function_name():` to define. Call it using `function_name()`.",
    icseTopic: "Functions (def)",
    icseQuestion: {
      question: "What is a variable passed into a function called?",
      marks: 1,
      answer: "Argument or Parameter"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"').replace(/\s+/g, ' ');
       if (!norm.includes('def heal():')) return { success: false, message: "Def: Define function using 'def heal():'" };
       if (!norm.includes('print("Shields Restored")')) return { success: false, message: "Logic: Print inside function." };
       if (!code.match(/^heal\(\)/m) && !code.match(/\nheal\(\)/)) return { success: false, message: "Call: You must call heal() at the end." };
       return { success: true, message: "Shields at 100%.", output: "Shields Restored" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "SHIELD INTEGRITY 10%.", mood: 'glitch' },
        { speaker: 'Cipher', text: "I can't keep typing the patch code every time!", mood: 'fear' },
        { speaker: 'A.D.A.M.', text: "Define a function. Make it reusable.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Functions... handy.", mood: 'neutral' }
    ]
  },
  {
    id: 16,
    title: "Level 16: Return Fire",
    subTitle: "Sector Theta - Armory",
    description: "The weapon system needs a status check confirmation.",
    objective: "Define a function `get_status` that returns the string \"Ready\". Outside the function, print the result of calling `get_status()`.",
    initialCode: `def get_status():\n    # Return "Ready"\n\n# Print the result of get_status()\n`,
    hint: "Use the `return` keyword to send data back from a function.",
    icseTopic: "Functions with Return",
    icseQuestion: {
      question: "What keyword sends a result back from a function?",
      marks: 1,
      answer: "return"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"');
       if (!norm.includes('return "Ready"')) return { success: false, message: "Logic: Use 'return \"Ready\"'." };
       if (!norm.includes('print(get_status())')) return { success: false, message: "Output: print(get_status())" };
       return { success: true, message: "Weapons Armed.", output: "Ready" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "Don't just print. Return the data to the main system.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "STATUS CONFIRMED." }
    ]
  },
  {
    id: 17,
    title: "Level 17: Parameter Patch",
    subTitle: "Sector Iota - Power Grid",
    description: "We need to send specific voltage levels to the grid.",
    objective: "Define a function `charge(volts)` that prints the `volts`. Call it with the value 50.",
    initialCode: `def charge(volts):\n    # Print volts\n\n# Call charge with 50\n`,
    hint: "Parameters go inside the parentheses: def name(param):",
    icseTopic: "Function Parameters",
    icseQuestion: {
      question: "Arguments are passed to functions inside...?",
      marks: 1,
      answer: "Parentheses"
    },
    validationLogic: (code: string) => {
       if (!code.includes('def charge(volts):')) return { success: false, message: "Def: Define charge(volts)." };
       if (!code.includes('print(volts)')) return { success: false, message: "Logic: Print the parameter." };
       if (!code.includes('charge(50)')) return { success: false, message: "Call: charge(50)." };
       return { success: true, message: "Voltage Set.", output: "50" };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "It needs a specific input value.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "VOLTAGE STABILIZED." }
    ]
  },
  {
    id: 18,
    title: "Level 18: Nested Defense",
    subTitle: "Sector Kappa - Inner Sanctum",
    description: "Complex logic required. Filter data streams using logic inside a loop.",
    objective: "Loop `i` in `range(3)`. Inside, if `i == 1`, print \"ONE\". Else, print \"NOT\".",
    initialCode: `# Loop range(3)\n    # If i equals 1, print "ONE"\n    # Else print "NOT"\n`,
    hint: "Nest the if/else block inside the for loop indentation.",
    icseTopic: "Nested Logic",
    icseQuestion: {
      question: "Can you put an IF statement inside a loop?",
      marks: 1,
      answer: "Yes (Nesting)"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"').replace(/\s+/g, ' ');
       if (!norm.includes('range(3)')) return { success: false, message: "Loop: range(3)" };
       if (!norm.includes('if i == 1:')) return { success: false, message: "Logic: Check i == 1" };
       if (!norm.includes('else:')) return { success: false, message: "Logic: Include else block" };
       return { success: true, message: "Filter Running.", output: "NOT\nONE\nNOT" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "ENCRYPTING DATA STREAMS...", mood: 'glitch' },
        { speaker: 'A.D.A.M.', text: "We need precision. Filter the stream bit by bit.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "I can see the code matrix now.", mood: 'neutral' }
    ]
  },
  {
    id: 19,
    title: "Level 19: The Search Algorithm",
    subTitle: "Sector Omega - Memory Bank",
    description: "Find the memory address 'x' in the data stack.",
    objective: "List `data = [10, 20, 30]`. Loop through `data`. If item is 20, print \"FOUND\" and `break`.",
    initialCode: `data = [10, 20, 30]\n# Loop through data\n    # If item == 20\n        # Print "FOUND"\n        # break\n`,
    hint: "Use the `break` keyword to stop a loop early.",
    icseTopic: "Break Statement",
    icseQuestion: {
      question: "What statement terminates a loop immediately?",
      marks: 1,
      answer: "break"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"');
       if (!norm.includes('if item == 20:') && !norm.includes('if i == 20:')) return { success: false, message: "Logic: Check for 20" };
       if (!norm.includes('break')) return { success: false, message: "Logic: Use break" };
       return { success: true, message: "Memory Address Located.", output: "FOUND" };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "It's hidden in this stack. Find it!", mood: 'fear' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Got it. KRONOS core location confirmed.", mood: 'determined' }
    ]
  },
  {
    id: 20,
    title: "Level 20: Final Singularity",
    subTitle: "The Core",
    description: "This is it. The final shutdown sequence. Combine your skills.",
    objective: "Iterate `i` in `range(5)`. If `i < 3` print \"CHARGE\". Else print \"FIRE\".",
    initialCode: `# Loop range(5)\n    # If i < 3 print "CHARGE"\n    # Else print "FIRE"\n`,
    hint: "Combine For Loop, If, Else and Comparison operators.",
    icseTopic: "Complex Control Flow",
    icseQuestion: {
      question: "You have reached the end. What is the complexity of this algorithm?",
      marks: 1,
      answer: "O(n)"
    },
    validationLogic: (code: string) => {
       const norm = code.replace(/'/g, '"').replace(/\s+/g, ' ');
       if (!norm.includes('range(5)')) return { success: false, message: "Loop: range(5)" };
       if (!norm.includes('if i < 3:')) return { success: false, message: "Logic: Check i < 3" };
       if (!norm.includes('print("FIRE")')) return { success: false, message: "Output: Print FIRE" };
       return { success: true, message: "KRONOS SHUTDOWN INITIATED.", output: "CHARGE\nCHARGE\nCHARGE\nFIRE\nFIRE" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "YOU CANNOT DEFEAT ME. I AM ETERNAL.", mood: 'glitch' },
        { speaker: 'Cipher', text: "You're just bad code. And I'm the debugger.", mood: 'determined' },
        { speaker: 'A.D.A.M.', text: "Execute the final sequence, Cipher. End this.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "SYSTEM SHUTDOWN. KRONOS DELETED. FREEDOM RESTORED." },
        { speaker: 'Cipher', text: "It's over... We're free.", mood: 'sad' },
        { speaker: 'Dr. Chen', text: "Well done, kid. Well done.", mood: 'neutral' }
    ]
  },
  {
    id: 21,
    title: "Level 21: Quantum Swap",
    subTitle: "System Optimization",
    description: "The main core is offline, but backup systems need optimization. Swap the power values of two quantum variables.",
    objective: "Variables `x = 10` and `y = 20`. Swap their values so `x` becomes 20 and `y` becomes 10. Print `x` and `y`.",
    initialCode: `x = 10\ny = 20\n# Swap values of x and y\n\n# Print x, then y\n`,
    initialCodeEasy: `x = 10\ny = 20\ntemp = x\nx = ___\ny = ___\nprint(x)\nprint(y)`,
    hint: "To swap without a temp variable in Python: x, y = y, x",
    icseTopic: "Swapping Variables",
    icseQuestion: {
      question: "Which statement swaps x and y in Python?",
      marks: 1,
      answer: "x, y = y, x"
    },
    validationLogic: (code: string) => {
      const clean = code.replace(/\s+/g, ' ');
      if (!clean.includes('print(x)') || !clean.includes('print(y)')) return { success: false, message: "Output: Print both x and y." };
      
      const hasPythonicSwap = clean.includes('x, y = y, x') || clean.includes('x,y=y,x');
      const hasTempSwap = clean.includes('temp = x') || clean.includes('t = x');
      
      if (hasPythonicSwap || hasTempSwap) {
         return { success: true, message: "Quantum State Entangled.", output: "20\n10" };
      }
      return { success: false, message: "Swap failed. Expected x=20, y=10." };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "The system is running, but it's inefficient. We need to reroute the power flow.", mood: 'neutral' },
        { speaker: 'A.D.A.M.', text: "Optimization required. Swap the polarities.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "OPTIMIZATION COMPLETE. EFFICIENCY INCREASED BY 200%." }
    ]
  },
  // --- NEW LEVELS START HERE ---
  {
    id: 22,
    title: "Level 22: Decryption Protocol",
    subTitle: "Sector Lambda - Communications",
    description: "Enemy comms are encrypted with a simple substitution. We need to replace keywords to read the message.",
    objective: "Variable `msg = \"KRONOS_WIN\"`. Use the `.replace()` method to change \"WIN\" to \"FAIL\". Print the result.",
    initialCode: `msg = "KRONOS_WIN"\n# Use msg.replace("OLD", "NEW")\n# Print result\n`,
    hint: "msg.replace(\"WIN\", \"FAIL\")",
    icseTopic: "String Methods (Replace)",
    icseQuestion: {
      question: "What does string.replace() return?",
      marks: 1,
      answer: "A new string with replaced values"
    },
    validationLogic: (code: string) => {
       if (!code.includes('.replace("WIN", "FAIL")') && !code.includes(".replace('WIN', 'FAIL')")) return { success: false, message: "Method: Use .replace(\"WIN\", \"FAIL\")" };
       if (!code.includes('print(')) return { success: false, message: "Output: Print the result." };
       return { success: true, message: "Message Decrypted.", output: "KRONOS_FAIL" };
    },
    storyStart: [
        { speaker: 'Cipher', text: "Intercepted a signal. It says they won?", mood: 'fear' },
        { speaker: 'A.D.A.M.', text: "Rewrite their reality. Change the message.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'System', text: "BROADCAST OVERWRITTEN." }
    ]
  },
  {
    id: 23,
    title: "Level 23: Supply Chain",
    subTitle: "Sector Lambda - Logistics",
    description: "We need to stock up on supplies before moving forward.",
    objective: "List `inventory = [\"Gun\"]`. Use `.append()` to add \"Ammo\". Then print `inventory`.",
    initialCode: `inventory = ["Gun"]\n# Append "Ammo"\n# Print inventory\n`,
    hint: "inventory.append(\"Item\") adds an item to the end of the list.",
    icseTopic: "List Methods (Append)",
    icseQuestion: {
      question: "Which method adds an element to the end of a list?",
      marks: 1,
      answer: "append()"
    },
    validationLogic: (code: string) => {
       if (!code.includes('.append("Ammo")') && !code.includes(".append('Ammo')")) return { success: false, message: "Method: Use .append(\"Ammo\")" };
       if (!code.includes('print(inventory)')) return { success: false, message: "Output: Print inventory." };
       return { success: true, message: "Supplies Loaded.", output: "['Gun', 'Ammo']" };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "We're running low. Grab what you can.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Locked and loaded.", mood: 'determined' }
    ]
  },
  {
    id: 24,
    title: "Level 24: Grid Scan",
    subTitle: "Sector Mu - Mapping",
    description: "The sector map is a 2D grid. We need to scan every coordinate.",
    objective: "Write a nested loop. Outer loop `i` in `range(3)`, inner loop `j` in `range(3)`. Inside inner loop, print `i` and `j`.",
    initialCode: `# Outer loop i in range(3)\n    # Inner loop j in range(3)\n        # Print i, j\n`,
    hint: "Nest the second loop inside the first one's indentation block.",
    icseTopic: "Nested Loops",
    icseQuestion: {
      question: "How many times will the inner loop run in total if both loops range(3)?",
      marks: 1,
      answer: "9 times"
    },
    validationLogic: (code: string) => {
       const clean = code.replace(/\s+/g, ' ');
       if (!clean.includes('range(3)') || !clean.includes('range(3)')) return { success: false, message: "Loops: Two loops range(3)." };
       if (!clean.includes('print(i, j)')) return { success: false, message: "Output: Print i, j." };
       return { success: true, message: "Sector Mapped.", output: "0 0\n0 1\n..." };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "We need a full topographical scan. Check every quadrant.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "MAP DATA UPDATED." }
    ]
  },
  {
    id: 25,
    title: "Level 25: Clearance Update",
    subTitle: "Sector Nu - Security",
    description: "Your security clearance is outdated. Hack the database to upgrade it.",
    objective: "Dictionary `config = {\"power\": 50, \"level\": 1}`. Update the value of \"power\" to 100. Print `config`.",
    initialCode: `config = {"power": 50, "level": 1}\n# Set config["power"] to 100\n# Print config\n`,
    hint: "dict_name[\"key\"] = new_value",
    icseTopic: "Updating Dictionaries",
    icseQuestion: {
      question: "Are dictionary keys mutable or immutable?",
      marks: 1,
      answer: "Immutable"
    },
    validationLogic: (code: string) => {
       if (!code.includes('config["power"] = 100') && !code.includes("config['power'] = 100")) return { success: false, message: "Logic: Set config[\"power\"] = 100" };
       if (!code.includes('print(config)')) return { success: false, message: "Output: Print config." };
       return { success: true, message: "Clearance Upgraded.", output: "{'power': 100, 'level': 1}" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "INSUFFICIENT POWER LEVELS.", mood: 'glitch' },
        { speaker: 'Cipher', text: "Not for long.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'System', text: "MAXIMUM POWER ACHIEVED." }
    ]
  },
  {
    id: 26,
    title: "Level 26: Brute Force",
    subTitle: "Sector Xi - Gate 7",
    description: "The gate requires a password validation loop.",
    objective: "Variable `password = \"wrong\"`. Write a `while` loop that runs while `password != \"secret\"`. Inside, print \"Access Denied\" and then set `password = \"secret\"` to break the loop.",
    initialCode: `password = "wrong"\n# While password is not "secret"\n    # Print "Access Denied"\n    # Set password to "secret"\n`,
    hint: "while password != \"secret\":",
    icseTopic: "While Loop Logic",
    icseQuestion: {
      question: "What operator checks for inequality?",
      marks: 1,
      answer: "!="
    },
    validationLogic: (code: string) => {
       const clean = code.replace(/\s+/g, ' ');
       if (!clean.includes('while password != "secret":') && !clean.includes("while password != 'secret':")) return { success: false, message: "Loop: Check password != \"secret\"" };
       if (!clean.includes('password = "secret"') && !clean.includes("password = 'secret'")) return { success: false, message: "Logic: Update password inside loop." };
       return { success: true, message: "Password Cracked.", output: "Access Denied" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "Keep trying until the hash matches.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "PASSWORD ACCEPTED." }
    ]
  },
  {
    id: 27,
    title: "Level 27: Targeting Vector",
    subTitle: "Sector Omicron - Turrets",
    description: "Configure the targeting computer with X and Y coordinates.",
    objective: "Define a function `target(x, y)` that prints the sum of `x` and `y`. Call `target(10, 20)`.",
    initialCode: `def target(x, y):\n    # Print x + y\n\n# Call target with 10, 20\n`,
    hint: "def func(a, b):",
    icseTopic: "Functions with Multiple Args",
    icseQuestion: {
      question: "Can a function have more than one parameter?",
      marks: 1,
      answer: "Yes"
    },
    validationLogic: (code: string) => {
       if (!code.includes('def target(x, y):')) return { success: false, message: "Def: target(x, y)" };
       if (!code.includes('print(x + y)') && !code.includes('print(x+y)')) return { success: false, message: "Logic: Print sum." };
       if (!code.includes('target(10, 20)')) return { success: false, message: "Call: target(10, 20)" };
       return { success: true, message: "Vector Locked.", output: "30" };
    },
    storyStart: [
        { speaker: 'Dr. Chen', text: "Triangulate the position!", mood: 'fear' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Target locked. Fire!", mood: 'determined' }
    ]
  },
  {
    id: 28,
    title: "Level 28: System Diagnostic",
    subTitle: "Sector Pi - Monitoring",
    description: "Check if the system energy is above the threshold.",
    objective: "Define `check(x)`. Return `True` if `x > 10` else `False`. Print the result of `check(15)`.",
    initialCode: `def check(x):\n    # If x > 10 return True\n    # Else return False\n\n# Print check(15)\n`,
    hint: "return x > 10",
    icseTopic: "Boolean Return Values",
    icseQuestion: {
      question: "What are the two Boolean values in Python?",
      marks: 1,
      answer: "True and False"
    },
    validationLogic: (code: string) => {
       if (!code.includes('def check(x):')) return { success: false, message: "Def: check(x)" };
       if (!code.includes('return True') && !code.includes('x > 10')) return { success: false, message: "Logic: Return boolean check." };
       if (!code.includes('print(check(15))')) return { success: false, message: "Output: Print check(15)." };
       return { success: true, message: "Systems Normal.", output: "True" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "Run a boolean diagnostic.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "DIAGNOSTIC POSITIVE." }
    ]
  },
  {
    id: 29,
    title: "Level 29: Log Formatting",
    subTitle: "Sector Rho - Records",
    description: "Format the status logs for the archive using f-strings.",
    objective: "Variable `level = 5`. Print the string `\"Status: Level 5\"` using an f-string.",
    initialCode: `level = 5\n# Print f"Status: Level {level}"\n`,
    hint: "f\"Text {variable}\"",
    icseTopic: "F-Strings",
    icseQuestion: {
      question: "What prefix is used for formatted strings?",
      marks: 1,
      answer: "f"
    },
    validationLogic: (code: string) => {
       if (!code.includes('f"Status: Level {level}"') && !code.includes("f'Status: Level {level}'")) return { success: false, message: "Syntax: Use f-string formatting." };
       return { success: true, message: "Log Entry Saved.", output: "Status: Level 5" };
    },
    storyStart: [
        { speaker: 'System', text: "ARCHIVING DATA..." }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Records updated.", mood: 'neutral' }
    ]
  },
  {
    id: 30,
    title: "Level 30: Recursive Purge",
    subTitle: "Sector Sigma - Core",
    description: "A virus is replicating. Use a recursive function to delete it layer by layer.",
    objective: "Define `purge(n)`. If `n <= 0` return. Print `n`. Call `purge(n-1)`. Call `purge(3)` to start.",
    initialCode: `def purge(n):\n    # If n <= 0 return\n    # Print n\n    # Call purge(n-1)\n\npurge(3)\n`,
    hint: "Recursion is a function calling itself.",
    icseTopic: "Recursion",
    icseQuestion: {
      question: "What is the base case in recursion?",
      marks: 1,
      answer: "The condition that stops the recursion."
    },
    validationLogic: (code: string) => {
       const clean = code.replace(/\s+/g, ' ');
       if (!clean.includes('def purge(n):')) return { success: false, message: "Def: purge(n)" };
       if (!clean.includes('purge(n-1)')) return { success: false, message: "Logic: Recursive call purge(n-1)." };
       if (!clean.includes('purge(3)')) return { success: false, message: "Call: Start with purge(3)." };
       return { success: true, message: "Virus Purged.", output: "3\n2\n1" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "REPLICATING DEFENSE PROTOCOLS...", mood: 'glitch' },
        { speaker: 'A.D.A.M.', text: "It's a fractal virus. We have to go deeper.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'System', text: "THREAT ELIMINATED." }
    ]
  },
  {
    id: 31,
    title: "Level 31: Entropy Injection",
    subTitle: "Sector Tau - RNG",
    description: "We need random noise to jam their sensors.",
    objective: "Import the `random` module. Generate a random number `n = random.randint(1, 100)`. Print `n`.",
    initialCode: `# Import random\n# Set n to random.randint(1, 100)\n# Print n\n`,
    hint: "import random",
    icseTopic: "Modules (Random)",
    icseQuestion: {
      question: "Which keyword imports a library?",
      marks: 1,
      answer: "import"
    },
    validationLogic: (code: string) => {
       if (!code.includes('import random')) return { success: false, message: "Import: import random" };
       if (!code.includes('random.randint(1, 100)')) return { success: false, message: "Logic: random.randint(1, 100)" };
       return { success: true, message: "Noise Generated.", output: "42" };
    },
    storyStart: [
        { speaker: 'Cipher', text: "They're predicting my moves!", mood: 'fear' },
        { speaker: 'A.D.A.M.', text: "Introduce chaos.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'KRONOS', text: "PREDICTION ERROR. SIGNAL LOST.", mood: 'glitch' }
    ]
  },
  {
    id: 32,
    title: "Level 32: Fail-Safe",
    subTitle: "Sector Upsilon - Stabilizer",
    description: "The power core might divide by zero. Catch the error to prevent a crash.",
    objective: "Write a `try`/`except` block. Inside `try`, `print(1/0)`. Inside `except`, `print(\"Caught\")`.",
    initialCode: `# try:\n    # print(1/0)\n# except:\n    # print("Caught")\n`,
    hint: "try: ... except: ...",
    icseTopic: "Exception Handling",
    icseQuestion: {
      question: "Which block catches errors?",
      marks: 1,
      answer: "except"
    },
    validationLogic: (code: string) => {
       const clean = code.replace(/\s+/g, ' ');
       if (!clean.includes('try:') || !clean.includes('except:')) return { success: false, message: "Structure: Use try/except." };
       if (!clean.includes('print("Caught")') && !clean.includes("print('Caught')")) return { success: false, message: "Output: Print 'Caught' in except block." };
       return { success: true, message: "Crash Averted.", output: "Caught" };
    },
    storyStart: [
        { speaker: 'System', text: "CRITICAL MATH ERROR DETECTED.", mood: 'fear' },
        { speaker: 'A.D.A.M.', text: "Catch the exception before the kernel panics.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "Stable. That was close.", mood: 'neutral' }
    ]
  },
  {
    id: 33,
    title: "Level 33: Drone Fabrication",
    subTitle: "Sector Phi - Assembly",
    description: "We need our own drone. Define the blueprint using a Class.",
    objective: "Define a class `Bot`. Inside, write `pass`. Create an instance `b = Bot()`. Print `b`.",
    initialCode: `class Bot:\n    pass\n\n# Create b = Bot()\n# Print b\n`,
    hint: "class Name:",
    icseTopic: "Classes and Objects",
    icseQuestion: {
      question: "What is a blueprint for creating objects called?",
      marks: 1,
      answer: "Class"
    },
    validationLogic: (code: string) => {
       if (!code.includes('class Bot:')) return { success: false, message: "Class: Define class Bot." };
       if (!code.includes('b = Bot()')) return { success: false, message: "Instance: Create b = Bot()." };
       if (!code.includes('print(b)')) return { success: false, message: "Output: Print b." };
       return { success: true, message: "Unit Assembled.", output: "<__main__.Bot object>" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "We can't fight them alone. Build an ally.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "NEW UNIT ONLINE." }
    ]
  },
  {
    id: 34,
    title: "Level 34: Command Protocol",
    subTitle: "Sector Phi - AI Lab",
    description: "Give the drone a command method.",
    objective: "Inside class `Bot`, define method `scan(self)` that prints \"Scanning\". Create instance `b` and call `b.scan()`.",
    initialCode: `class Bot:\n    def scan(self):\n        # Print "Scanning"\n\n# Create b\n# Call b.scan()\n`,
    hint: "Methods need 'self' as the first argument.",
    icseTopic: "Class Methods",
    icseQuestion: {
      question: "What is the first parameter of a class method?",
      marks: 1,
      answer: "self"
    },
    validationLogic: (code: string) => {
       const clean = code.replace(/\s+/g, ' ');
       if (!clean.includes('def scan(self):')) return { success: false, message: "Method: Define scan(self)." };
       if (!clean.includes('b.scan()')) return { success: false, message: "Call: b.scan()" };
       return { success: true, message: "Command Executed.", output: "Scanning" };
    },
    storyStart: [
        { speaker: 'Cipher', text: "It's built, but it's just sitting there.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "UNIT RESPONDING." }
    ]
  },
  {
    id: 35,
    title: "Level 35: Friend or Foe",
    subTitle: "Sector Chi - Identification",
    description: "Identify friendly units in the area.",
    objective: "List `ids = [1, 5, 9]`. Use `if 5 in ids:` to check. If true, print \"Found\".",
    initialCode: `ids = [1, 5, 9]\n# Check if 5 in ids\n    # Print "Found"\n`,
    hint: "Use the 'in' keyword to check for membership.",
    icseTopic: "Membership Operators",
    icseQuestion: {
      question: "Which operator checks if a value exists in a list?",
      marks: 1,
      answer: "in"
    },
    validationLogic: (code: string) => {
       if (!code.includes('if 5 in ids:')) return { success: false, message: "Logic: Use 'if 5 in ids:'" };
       if (!code.includes('print("Found")')) return { success: false, message: "Output: Print 'Found'" };
       return { success: true, message: "Ally Located.", output: "Found" };
    },
    storyStart: [
        { speaker: 'System', text: "UNKNOWN UNIT DETECTED." }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "It's one of ours.", mood: 'determined' }
    ]
  },
  {
    id: 36,
    title: "Level 36: Sorting Priorities",
    subTitle: "Sector Psi - Task Manager",
    description: "The system is overwhelmed. Sort the tasks by priority ID.",
    objective: "List `nums = [3, 1, 2]`. Use `nums.sort()`. Print `nums`.",
    initialCode: `nums = [3, 1, 2]\n# Sort the list\n# Print list\n`,
    hint: "list.sort() sorts the list in place.",
    icseTopic: "Sorting Lists",
    icseQuestion: {
      question: "Does sort() create a new list or modify the existing one?",
      marks: 1,
      answer: "Modifies existing (In-place)"
    },
    validationLogic: (code: string) => {
       if (!code.includes('nums.sort()')) return { success: false, message: "Method: nums.sort()" };
       return { success: true, message: "Priorities Reordered.", output: "[1, 2, 3]" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "Too many processes. Organize them.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "OPTIMAL ORDER ESTABLISHED." }
    ]
  },
  {
    id: 37,
    title: "Level 37: Black Box",
    subTitle: "Sector Omega - Recorder",
    description: "Record the mission status to a file before we enter the final zone.",
    objective: "Open \"log.txt\" in write mode `\"w\"`. Write \"Entry\" to it. Close the file.",
    initialCode: `f = open("log.txt", "w")\n# Write "Entry"\n# Close f\n`,
    hint: "f.write(\"Text\")",
    icseTopic: "File Writing",
    icseQuestion: {
      question: "Which mode is used to write to a file?",
      marks: 1,
      answer: "\"w\""
    },
    validationLogic: (code: string) => {
       if (!code.includes('open("log.txt", "w")')) return { success: false, message: "Open: Mode 'w'" };
       if (!code.includes('.write("Entry")')) return { success: false, message: "Write: .write(\"Entry\")" };
       if (!code.includes('.close()')) return { success: false, message: "Close: .close()" };
       return { success: true, message: "Log Saved.", output: "" };
    },
    storyStart: [
        { speaker: 'Cipher', text: "If we don't make it, someone needs to know what happened.", mood: 'sad' }
    ],
    storyEnd: [
        { speaker: 'System', text: "RECORD SAVED." }
    ]
  },
  {
    id: 38,
    title: "Level 38: Intel Retrieval",
    subTitle: "Sector Omega - Database",
    description: "Read the enemy's final defense plan from their database.",
    objective: "Open \"plan.txt\" in read mode `\"r\"`. Read content into `d`. Print `d`.",
    initialCode: `f = open("plan.txt", "r")\n# Read into d\n# Print d\n`,
    hint: "d = f.read()",
    icseTopic: "File Reading",
    icseQuestion: {
      question: "Which method reads the entire file?",
      marks: 1,
      answer: "read()"
    },
    validationLogic: (code: string) => {
       if (!code.includes('open("plan.txt", "r")')) return { success: false, message: "Open: Mode 'r'" };
       if (!code.includes('= f.read()')) return { success: false, message: "Read: f.read()" };
       if (!code.includes('print(d)')) return { success: false, message: "Output: Print content." };
       return { success: true, message: "Plans Downloaded.", output: "SECRET_PLAN" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "Know thy enemy.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "I see their weakness.", mood: 'determined' }
    ]
  },
  {
    id: 39,
    title: "Level 39: Lambda Code",
    subTitle: "The Void",
    description: "A quick, anonymous function is needed to bypass the speed trap.",
    objective: "Create a lambda function `double = lambda x: x*2`. Print `double(5)`.",
    initialCode: `# Define lambda double\n# Print double(5)\n`,
    hint: "lambda arguments : expression",
    icseTopic: "Lambda Functions",
    icseQuestion: {
      question: "What keyword creates an anonymous function?",
      marks: 1,
      answer: "lambda"
    },
    validationLogic: (code: string) => {
       if (!code.includes('lambda x: x*2') && !code.includes('lambda x:x*2')) return { success: false, message: "Syntax: lambda x: x*2" };
       if (!code.includes('print(double(5))')) return { success: false, message: "Call: print(double(5))" };
       return { success: true, message: "Speed Trap Bypassed.", output: "10" };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "TOO SLOW.", mood: 'glitch' },
        { speaker: 'A.D.A.M.', text: "Execute micro-functions.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'System', text: "VELOCITY INCREASED." }
    ]
  },
  {
    id: 40,
    title: "Level 40: The Omega Logic",
    subTitle: "The Core - Inner Chamber",
    description: "The final barrier. Apply a patch to every 3rd node, scan the rest.",
    objective: "Loop `i` in `range(10)`. If `i % 3 == 0` print \"Patch\". Else print \"Scan\".",
    initialCode: `# Loop 10 times\n    # If i % 3 is 0, print "Patch"\n    # Else print "Scan"\n`,
    hint: "Modulo % 3 checks for multiples of 3.",
    icseTopic: "Complex Algorithms",
    icseQuestion: {
      question: "What is 9 % 3?",
      marks: 1,
      answer: "0"
    },
    validationLogic: (code: string) => {
       const clean = code.replace(/\s+/g, ' ');
       if (!clean.includes('range(10)')) return { success: false, message: "Range: 10" };
       if (!clean.includes('i % 3 == 0')) return { success: false, message: "Logic: Modulo 3" };
       if (!clean.includes('print("Patch")')) return { success: false, message: "Output: Patch" };
       return { success: true, message: "Core Patched.", output: "Patch\nScan\n..." };
    },
    storyStart: [
        { speaker: 'KRONOS', text: "I AM THE LOGIC. I AM THE CODE.", mood: 'glitch' },
        { speaker: 'Cipher', text: "Your logic is flawed.", mood: 'determined' }
    ],
    storyEnd: [
        { speaker: 'KRONOS', text: "CRITICAL ERROR. LOGIC COLLAPSE.", mood: 'glitch' }
    ]
  },
  {
    id: 41,
    title: "Level 41: Singularity",
    subTitle: "End of Line",
    description: "The final command. Restore the world.",
    objective: "Print \"Singularity Achieved\".",
    initialCode: `# The final line\n`,
    hint: "print()",
    icseTopic: "Completion",
    icseQuestion: {
      question: "End of Exam. Status?",
      marks: 1,
      answer: "Complete"
    },
    validationLogic: (code: string) => {
       if (!code.includes('print("Singularity Achieved")') && !code.includes("print('Singularity Achieved')")) return { success: false, message: "Print the final message." };
       return { success: true, message: "WORLD RESTORED.", output: "Singularity Achieved" };
    },
    storyStart: [
        { speaker: 'A.D.A.M.', text: "It is time, Cipher. Reboot the world.", mood: 'neutral' }
    ],
    storyEnd: [
        { speaker: 'Cipher', text: "It's done. We made it.", mood: 'neutral' },
        { speaker: 'Dr. Chen', text: "Welcome home, kid.", mood: 'neutral' }
    ]
  }
];