/**
 * TypeSprint - Practice Paragraphs Library
 * Contains 60+ diverse practice passages categorized across 3 difficulty tiers:
 * Beginner, Intermediate, and Advanced.
 */

const PRACTICE_TEXTS = {
  beginner: [
    {
      id: "b-01",
      topic: "Morning Routine",
      text: "The sun rises early in the morning and brings a fresh new day. A warm cup of tea and a brisk walk can make you feel alive and ready to learn."
    },
    {
      id: "b-02",
      topic: "Reading Books",
      text: "Reading books is a wonderful habit that helps you grow. You can travel to new worlds and meet interesting people without ever leaving your home."
    },
    {
      id: "b-03",
      topic: "Healthy Habits",
      text: "Drinking plenty of clean water every day keeps your body active and strong. Eating fresh fruits and green vegetables gives you natural energy."
    },
    {
      id: "b-04",
      topic: "The Ocean",
      text: "The blue ocean is vast and full of mysterious life. Gentle waves wash over the sandy beach while seagulls fly high in the bright sky."
    },
    {
      id: "b-05",
      topic: "Friendship",
      text: "A true friend is someone who listens to your thoughts and stands by your side. Good friends share laughter, kind words, and sweet memories."
    },
    {
      id: "b-06",
      topic: "Cooking at Home",
      text: "Cooking a homemade meal brings joy to the whole family. The smell of fresh bread baking in the oven fills every room with warmth."
    },
    {
      id: "b-07",
      topic: "Walking in the Woods",
      text: "Tall green trees sway gently in the cool breeze. Walking along a quiet dirt path allows your mind to rest and enjoy the peace of nature."
    },
    {
      id: "b-08",
      topic: "Learning to Type",
      text: "Practice is the key to typing faster with fewer mistakes. Keep your fingers resting on the home row keys and look at the screen as you type."
    },
    {
      id: "b-09",
      topic: "Pet Companions",
      text: "Dogs are loyal companions that love to run and play in the park. Cats like to take quiet naps in sunny spots on the wooden floor."
    },
    {
      id: "b-10",
      topic: "Bicycle Ride",
      text: "Riding a bicycle along the quiet lake is both fun and relaxing. The wind touches your face as the wheels spin smoothly along the trail."
    },
    {
      id: "b-11",
      topic: "Spring Flowers",
      text: "Spring brings colorful blossoms to every garden and park. Bright yellow tulips and red roses open their petals under the gentle rain."
    },
    {
      id: "b-12",
      topic: "Night Sky",
      text: "Look up at the clear dark sky to see thousands of twinkling stars. The moon shines with a soft white light that guides travelers at night."
    },
    {
      id: "b-13",
      topic: "Music and Joy",
      text: "Listening to your favorite song can lift your mood in an instant. Sweet melodies and steady rhythms make people smile and want to dance."
    },
    {
      id: "b-14",
      topic: "A Rainy Afternoon",
      text: "Soft raindrops tap against the window glass while you sit inside. A cozy warm blanket and a story make any rainy afternoon special."
    },
    {
      id: "b-15",
      topic: "Team Sports",
      text: "Playing games together teaches people how to support their team. When everyone works toward a single goal, winning becomes much sweeter."
    },
    {
      id: "b-16",
      topic: "The Power of Kindness",
      text: "A simple smile or a polite greeting can brighten someone's day. Small acts of kindness cost nothing but mean a great deal to others."
    },
    {
      id: "b-17",
      topic: "Art and Colors",
      text: "Drawing pictures with vibrant crayons lets your imagination fly. Mixing blue and yellow paint creates a fresh shade of green on paper."
    },
    {
      id: "b-18",
      topic: "Camping Out",
      text: "Sitting around a glowing campfire under the starry sky is magical. Roasting sweet treats and sharing tales makes camping unforgettable."
    },
    {
      id: "b-19",
      topic: "Daily Focus",
      text: "Taking a deep breath helps you stay calm and centered. When you concentrate on one task at a time, you finish faster with pride."
    },
    {
      id: "b-20",
      topic: "Writing Stories",
      text: "Writing simple stories helps you share your dreams with the world. Every word you write is a small step toward mastering your voice."
    }
  ],

  intermediate: [
    {
      id: "i-01",
      topic: "Artificial Intelligence",
      text: "Artificial intelligence has transformed modern software development by automating routine tasks. Machine learning models analyze vast datasets to detect patterns that human observers might overlook."
    },
    {
      id: "i-02",
      topic: "Web Development",
      text: "Building modern responsive websites requires an understanding of HTML, CSS, and JavaScript. Fluid layouts adapt smoothly across smartphones, tablets, and wide desktop screens without breaking visual harmony."
    },
    {
      id: "i-03",
      topic: "Renewable Energy",
      text: "Solar panels and offshore wind turbines are rapidly replacing fossil fuels across the globe. Transitioning toward clean energy helps reduce carbon emissions and preserves ecosystems for future generations."
    },
    {
      id: "i-04",
      topic: "Cloud Computing",
      text: "Cloud infrastructure allows engineering teams to deploy distributed microservices globally. Scalable server clusters automatically handle unexpected traffic surges while maintaining low latency for users."
    },
    {
      id: "i-05",
      topic: "Deep Space Exploration",
      text: "Space telescopes capture stunning infrared images of distant nebulae and emerging star systems. Robotic rovers traverse the rugged Martian landscape, searching for microscopic indicators of ancient water."
    },
    {
      id: "i-06",
      topic: "The Psychology of Habits",
      text: "Building a consistent daily habit relies on cue recognition, consistent execution, and meaningful rewards. Repeating small positive behaviors compound over time into remarkable lifelong achievements."
    },
    {
      id: "i-07",
      topic: "Cybersecurity Basics",
      text: "Strong password hygiene and multi-factor authentication protect personal identities from digital compromise. Regular software patching eliminates vulnerabilities before malicious actors can exploit them."
    },
    {
      id: "i-08",
      topic: "Open Source Software",
      text: "Collaborative open source projects empower developers worldwide to build transparent tools together. When code is reviewed by thousands of eyes, security flaws are spotted and fixed much faster."
    },
    {
      id: "i-09",
      topic: "Ocean Ecosystems",
      text: "Coral reefs provide essential habitats for over a quarter of all marine organisms. Warmer ocean temperatures threaten these delicate underwater sanctuaries, highlighting the urgent need for conservation."
    },
    {
      id: "i-10",
      topic: "Agile Methodologies",
      text: "Agile teams break complex quarterly roadmaps into two-week iterative development sprints. Daily standup meetings and retrospective reviews foster continuous alignment and rapid problem solving."
    },
    {
      id: "i-11",
      topic: "Mobile Computing",
      text: "Modern mobile processors combine high-efficiency performance cores with specialized neural processing units. These compact silicon architectures deliver workstation performance while maintaining all-day battery life."
    },
    {
      id: "i-12",
      topic: "Urban Architecture",
      text: "Contemporary architectural design balances aesthetic grandeur with environmental sustainability. Modern skyscrapers incorporate vertical gardens and rainwater harvesting systems directly into their structural facades."
    },
    {
      id: "i-13",
      topic: "Digital Typography",
      text: "Selecting the ideal typographic hierarchy improves legibility and elevates user engagement. Variable fonts enable designers to fine-tune letter spacing, line height, and font weight with lightweight stylesheets."
    },
    {
      id: "i-14",
      topic: "Data Visualization",
      text: "Interactive data charts transform dense numerical records into compelling visual narratives. Well-crafted graphs allow business analysts to grasp complex seasonal trends with a single glance."
    },
    {
      id: "i-15",
      topic: "Cognitive Load in UX",
      text: "User interface designers minimize unnecessary cognitive friction by eliminating visual clutter. Intuitive workflows guide visitors toward their primary objective without demanding excessive mental effort."
    },
    {
      id: "i-16",
      topic: "The Evolution of Internet",
      text: "From early dial-up modems transmitting kilobytes to fiber-optic networks handling gigabits, the internet has connected billions. Real-time streaming and video conferencing are now seamless everyday occurrences."
    },
    {
      id: "i-17",
      topic: "Autonomous Vehicles",
      text: "Self-driving transport relies on fused lidar, radar, and high-resolution camera feeds. Deep neural networks process incoming sensor streams in milliseconds to negotiate urban intersections safely."
    },
    {
      id: "i-18",
      topic: "Microbiome and Wellness",
      text: "Recent medical studies reveal how deeply gut microbiome diversity influences physical and mental vitality. A balanced diet rich in fermented foods and diverse fiber fosters beneficial microorganisms."
    },
    {
      id: "i-19",
      topic: "History of Printing",
      text: "The invention of movable metal type revolutionized the dissemination of knowledge across Europe. Inexpensive books ignited the scientific revolution and made literacy accessible to millions of people."
    },
    {
      id: "i-20",
      topic: "Touch Typing Mastery",
      text: "Mastering muscle memory allows touch typists to translate thoughts directly into text without looking down. Consistent rhythm and disciplined finger positioning dramatically reduce physical strain and mental fatigue."
    }
  ],

  advanced: [
    {
      id: "a-01",
      topic: "Asynchronous Concurrency",
      text: "In JavaScript, asynchronous workflows rely on the Event Loop, Microtask Queue (Promises), and Macrotask Queue (setTimeout). When executing `await fetch('/api/v1/metrics')`, the engine suspends execution without blocking the main rendering thread!"
    },
    {
      id: "a-02",
      topic: "Distributed Consensus",
      text: "Protocols such as Raft and Paxos resolve the Byzantine Generals problem in distributed databases. By requiring a strict majority quorum (e.g., 3-of-5 nodes), clusters safely commit log entries despite packet loss, jitter, and partition splits."
    },
    {
      id: "a-03",
      topic: "Quantum Superposition",
      text: "Quantum computing leverages qubits capable of existing in superpositions of |0⟩ and |1⟩ states simultaneously. Quantum entanglement enables algorithms like Shor's and Grover's to execute polynomial-time factorizations, defying classical complexity limits."
    },
    {
      id: "a-04",
      topic: "Memory Management & Pointers",
      text: "Low-level languages like Rust and C++ enforce strict memory safety semantics. RAII (Resource Acquisition Is Initialization), borrow checkers, and smart pointers (`std::unique_ptr<T>`, `Arc<Mutex<T>>`) eliminate use-after-free and double-free bugs."
    },
    {
      id: "a-05",
      topic: "Cryptography & Zero-Knowledge",
      text: "Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs) verify transaction validity without revealing underlying data: prover P convinces verifier V that statement S holds true with proof size under 256 bytes!"
    },
    {
      id: "a-06",
      topic: "Compiler Optimization",
      text: "Modern LLVM and GCC backends apply sophisticated pipeline passes: dead-code elimination, loop vectorization (AVX-512), and inline substitution. These aggressive compiler transformations shrink CPU cycles by 35% to 70%."
    },
    {
      id: "a-07",
      topic: "Database Indexing & B-Trees",
      text: "Relational storage engines utilize B+ trees with branching factor B=100+, ensuring disk block reads stay within O(log_B N) lookups. Write-Ahead Logging (WAL) and ACID guarantees ensure data durability across sudden power disruptions."
    },
    {
      id: "a-08",
      topic: "Computer Vision & Convolutions",
      text: "Residual Networks (ResNet-152) employ skip connections to combat vanishing gradients during backpropagation: y = F(x, {W_i}) + x. Batch normalization and Adam optimizers stabilize gradient descent across multi-gigapixel video streams."
    },
    {
      id: "a-09",
      topic: "Network Sockets & TCP/IP",
      text: "Establishing reliable transport requires a three-way TCP handshake (SYN, SYN-ACK, ACK), while QUIC over UDP eliminates head-of-line blocking. TLS 1.3 accelerates session resumption down to 0-RTT using pre-shared symmetric keys (AES-256-GCM)."
    },
    {
      id: "a-10",
      topic: "Operating System Kernels",
      text: "Monolithic kernels manage virtual memory through multi-level paging tables (CR3 register) and Translation Lookaside Buffers (TLB). Context switches between user mode (Ring 3) and kernel mode (Ring 0) incur strict register saves and cache penalties."
    },
    {
      id: "a-11",
      topic: "Graph Theory & Dijkstra",
      text: "Finding shortest paths in weighted directed graphs G=(V, E) takes O((|V| + |E|) log |V|) with Fibonacci heaps. Applications span GPS navigation, BGP routing tables, and peer-to-peer overlay topologies."
    },
    {
      id: "a-12",
      topic: "Functional Programming",
      text: "Higher-order combinators (`map`, `filter`, `reduce`), referential transparency, and immutable persistent data structures (HAMTs) eliminate side-effects. Monadic error chaining (`Result<T, E>`) obsoletes unhandled null pointer exceptions!"
    },
    {
      id: "a-13",
      topic: "High-Frequency Trading",
      text: "Sub-microsecond electronic market making requires kernel bypass (DPDK/Solarflare OpenOnload), FPGA hardware synthesis, and lock-free ring buffers (LMAX Disruptor). Market orders execute in < 450 nanoseconds across colocation centers."
    },
    {
      id: "a-14",
      topic: "Bioinformatics & DNA Sequencing",
      text: "High-throughput Next-Generation Sequencing (NGS) aligns billions of 150-bp reads against the 3.2-billion-base human reference genome (GRCh38). Burrows-Wheeler Transform (BWT) indexing accelerates exact string matches exponentially."
    },
    {
      id: "a-15",
      topic: "Astrophysics & Black Holes",
      text: "At the Schwarzschild event horizon (r_s = 2GM / c^2), gravitational time dilation approaches infinity relative to distant observers. Infalling matter creates relativistic accretion disks radiating extreme X-ray emissions!"
    },
    {
      id: "a-16",
      topic: "Container Orchestration",
      text: "Kubernetes orchestrates containerized pods via declarative etcd state declarations, controllers, and kube-scheduler. Service meshes like Istio inject Envoy sidecar proxies to enforce mutual TLS (mTLS) and canary traffic routing."
    },
    {
      id: "a-17",
      topic: "WebAssembly & JIT Execution",
      text: "WebAssembly (Wasm) provides a binary instruction format for stack-based virtual machines running alongside V8 and SpiderMonkey. It enables near-native C++/Rust compilation speeds: `i32.add`, `f64.mul`, and SIMD intrinsics inside the browser sandbox!"
    },
    {
      id: "a-18",
      topic: "Theoretical Physics & Entropy",
      text: "The Second Law of Thermodynamics dictates that total entropy S = k_B * ln(Ω) of an isolated system never decreases: ΔS ≥ 0. Statistical mechanics links microscopic microstates to macroscopic thermodynamic irreversibility."
    },
    {
      id: "a-19",
      topic: "GPU Architecture & Shaders",
      text: "Massively parallel SIMT (Single Instruction, Multiple Threads) compute pipelines execute thousands of concurrent warps. Ray tracing cores accelerate BVH (Bounding Volume Hierarchy) tree traversals for real-time path tracing at 4K 120Hz."
    },
    {
      id: "a-20",
      topic: "Full-Stack System Architecture",
      text: "Architecting resilient distributed microservices demands idempotent RESTful endpoints, circuit breakers (Resilience4j), distributed tracing (OpenTelemetry/Jaeger), and multi-region failover replication with < 99.999% SLA downtime tolerance!"
    }
  ]
};

// Expose helper to get random text by difficulty
function getRandomPracticeText(difficulty = 'intermediate', excludeId = null) {
  const pool = PRACTICE_TEXTS[difficulty] || PRACTICE_TEXTS.intermediate;
  if (!pool || pool.length === 0) return null;
  
  if (pool.length === 1) return pool[0];
  
  let filtered = pool;
  if (excludeId) {
    filtered = pool.filter(item => item.id !== excludeId);
    if (filtered.length === 0) filtered = pool;
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

// Export for module or global window scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRACTICE_TEXTS, getRandomPracticeText };
}
