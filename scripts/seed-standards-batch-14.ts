// @ts-nocheck
/**
 * Batch 14: grade 3 mathematics.
 *
 * Finishes grade 3, and with it the whole 3rd grade deck.
 *
 * The misconceptions here are unusually sharp, and several are about rules
 * learned without meaning: five or more raise the score, add a zero, count the
 * tick marks. Each of those works until it does not, and the moment it stops
 * working is usually years later. The blueprints go after the meaning rather
 * than the rule.
 *
 * American spellings throughout.
 *
 *   bun run scripts/seed-standards-batch-14.ts
 */
import { seedStandardsBatch } from "./lib/seed-standards-batch";

const standardsData = [
  {
    code: "3.OA.A.2",
    name: "Division has two meanings",
    plain_reading:
      "Interpret whole-number quotients of whole numbers as the number of objects in each share or the number of shares.",
    learning_target: "I can tell whether a problem is asking how many groups or how many in each group.",
    skills: ["Partitive Division", "Measurement Division", "Representing Division"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["quotient", "share equally", "how many groups", "partitive measurement division", "third grade"],
  },
  {
    code: "3.OA.A.3",
    name: "Model the situation, not the keywords",
    plain_reading:
      "Use multiplication and division within 100 to solve word problems in situations involving equal groups, arrays, and measurement quantities.",
    learning_target: "I can draw what is happening instead of hunting for a keyword.",
    skills: ["Word Problems", "Modeling", "Equations with Unknowns"],
    science_tags: ["dual-coding", "metacognition"],
    match_keys: ["multiplication and division word problems", "equal groups arrays", "symbol for the unknown", "keywords", "within 100"],
  },
  {
    code: "3.OA.A.4",
    name: "The equal sign means balance",
    plain_reading:
      "Determine the unknown whole number in a multiplication or division equation relating three whole numbers.",
    learning_target: "I can solve 8 × ? = 48 because the equal sign means the two sides match.",
    skills: ["Missing Factor", "Inverse Operations", "Equation Balance"],
    science_tags: ["elaboration", "metacognition"],
    match_keys: ["unknown whole number", "missing factor", "inverse", "equal sign", "equation"],
  },
  {
    code: "3.OA.B.5",
    name: "Break a factor apart",
    plain_reading: "Apply properties of operations as strategies to multiply and divide.",
    learning_target: "I can turn 7 × 8 into 7 × 5 plus 7 × 3.",
    skills: ["Distributive Property", "Commutative Property", "Decomposing Factors"],
    science_tags: ["elaboration", "dual-coding"],
    match_keys: ["commutative associative distributive", "properties of operations", "break apart a factor", "strategies"],
  },
  {
    code: "3.OA.B.6",
    name: "Division is a missing factor",
    plain_reading: "Understand division as an unknown-factor problem.",
    learning_target: "I can use a multiplication fact I already know to divide.",
    skills: ["Unknown Factor", "Fact Families", "Inverse Relationship"],
    science_tags: ["retrieval", "elaboration"],
    match_keys: ["division as unknown factor", "fact family", "inverse", "multiplication facts", "divide"],
  },
  {
    code: "3.OA.C.7",
    name: "Facts from anchors, then from memory",
    plain_reading:
      "Fluently multiply and divide within 100. By the end of grade 3, know from memory all products of two one-digit numbers.",
    learning_target: "I can build the hard facts from the ones I already know.",
    skills: ["Fluency", "Derived Facts", "Recall"],
    science_tags: ["retrieval", "spaced"],
    match_keys: ["fluently multiply and divide", "know from memory", "products of one-digit numbers", "anchor facts", "strategies"],
  },
  {
    code: "3.OA.D.9",
    name: "Explain the pattern, not just spot it",
    plain_reading:
      "Identify arithmetic patterns, including patterns in the addition table or multiplication table, and explain them using properties of operations.",
    learning_target: "I can say why the pattern happens, not just that it does.",
    skills: ["Arithmetic Patterns", "Explanation", "Properties"],
    science_tags: ["elaboration", "metacognition"],
    match_keys: ["arithmetic patterns", "multiplication table", "explain using properties", "multiples", "even odd"],
  },
  {
    code: "3.NBT.A.1",
    name: "Round by asking which is closer",
    plain_reading:
      "Use place value understanding to round whole numbers to the nearest 10 or 100.",
    learning_target: "I can put the number on a line and see which benchmark is nearer.",
    skills: ["Rounding", "Number Line", "Place Value"],
    science_tags: ["dual-coding", "metacognition"],
    match_keys: ["round to the nearest 10 or 100", "halfway", "number line", "place value", "estimate"],
  },
  {
    code: "3.NBT.A.3",
    name: "Why the zero appears",
    plain_reading:
      "Multiply one-digit whole numbers by multiples of 10 in the range 10-90 using strategies based on place value.",
    learning_target: "I can explain why 4 × 30 is 120 instead of just adding a zero.",
    skills: ["Multiples of Ten", "Place Value Reasoning", "Pattern Explanation"],
    science_tags: ["elaboration", "dual-coding"],
    match_keys: ["multiply by multiples of 10", "place value strategies", "add a zero", "pattern in the zeros"],
  },
  {
    code: "3.NF.A.2",
    name: "A fraction is a number on the line",
    plain_reading:
      "Understand a fraction as a number on the number line; represent fractions on a number line diagram.",
    learning_target: "I can find where three quarters lives between zero and one.",
    skills: ["Fractions on a Number Line", "Partitioning Intervals", "Unit Fractions"],
    science_tags: ["dual-coding", "metacognition"],
    match_keys: ["fraction as a number", "number line diagram", "partition the interval", "unit fraction", "locate a/b"],
  },
  {
    code: "3.MD.A.2",
    name: "Mass is not size",
    plain_reading:
      "Measure and estimate liquid volumes and masses of objects using grams, kilograms, and liters; solve one-step problems involving these units.",
    learning_target: "I can choose the right unit and know a big thing can be light.",
    skills: ["Mass and Volume", "Metric Units", "Estimation"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["liquid volume", "mass", "grams kilograms liters", "estimate", "one-step problems"],
  },
  {
    code: "3.MD.B.3",
    name: "Scaled graphs, where a square is not one",
    plain_reading:
      "Draw a scaled picture graph and a scaled bar graph to represent a data set with several categories; solve problems using the graphs.",
    learning_target: "I can read the key before I read a bar.",
    skills: ["Scaled Graphs", "Keys", "Two-Step Problems"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["scaled picture graph", "scaled bar graph", "key", "scale greater than one", "two-step problems"],
  },
  {
    code: "3.MD.B.4",
    name: "Measure to the quarter inch",
    plain_reading:
      "Generate measurement data by measuring lengths using rulers marked with halves and fourths of an inch; show the data on a line plot.",
    learning_target: "I can measure to the nearest quarter inch instead of rounding to whole ones.",
    skills: ["Fractional Measurement", "Line Plots", "Precision"],
    science_tags: ["dual-coding", "metacognition"],
    match_keys: ["halves and fourths of an inch", "line plot", "measurement data", "precision", "scale in halves"],
  },
  {
    code: "3.MD.C.5",
    name: "Area is covering",
    plain_reading:
      "Recognize area as an attribute of plane figures and understand concepts of area measurement.",
    learning_target: "I can say whether a question is about covering or about going around.",
    skills: ["Concept of Area", "Unit Square", "Covering Without Gaps"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["area as an attribute", "unit square", "square units", "cover without gaps", "plane figure"],
  },
  {
    code: "3.MD.C.6",
    name: "Count the squares, all of them",
    plain_reading: "Measure areas by counting unit squares.",
    learning_target: "I can count area without skipping or double-counting.",
    skills: ["Counting Unit Squares", "Square Units", "Irregular Shapes"],
    science_tags: ["dual-coding", "metacognition"],
    match_keys: ["measure area", "counting unit squares", "square cm square in", "irregular shapes", "partial squares"],
  },
  {
    code: "3.MD.D.8",
    name: "Perimeter goes around",
    plain_reading:
      "Solve real world and mathematical problems involving perimeters of polygons, including finding an unknown side length.",
    learning_target: "I can find a missing side when I know the perimeter.",
    skills: ["Perimeter", "Unknown Side Length", "Area Versus Perimeter"],
    science_tags: ["dual-coding", "interleaving"],
    match_keys: ["perimeter of polygons", "unknown side length", "same perimeter different areas", "real world problems"],
  },
  {
    code: "3.G.A.2",
    name: "Equal areas, different shapes",
    plain_reading:
      "Partition shapes into parts with equal areas; express the area of each part as a unit fraction of the whole.",
    learning_target: "I can split a shape into equal areas that do not have to look the same.",
    skills: ["Partitioning", "Unit Fractions", "Equal Area"],
    science_tags: ["dual-coding", "elaboration"],
    match_keys: ["partition shapes equal areas", "unit fraction of the whole", "equal area not congruent", "geometry fractions"],
  },
];
