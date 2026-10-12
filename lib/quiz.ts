export function checkAnswers(
  answers: (number | null)[],
  expected: number[],
): { correct: number; total: number } | null {
  if (
    answers.length !== expected.length ||
    answers.some(
      (answer) =>
        answer === null ||
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer > 4,
    )
  )
    return null;
  return {
    correct: answers.filter((answer, index) => answer === expected[index])
      .length,
    total: expected.length,
  };
}
