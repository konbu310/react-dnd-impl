import { nanoid } from "nanoid";

export type State = {
  id: string;
  value: string;
}[];

export const genTestData = (length: number): State =>
  Array.from({ length }).map((_, index) => ({
    id: nanoid(),
    value: String(index),
  }));

export const arrayMove = <T = any>(arr: T[], from: number, to: number): T[] => {
  const newArr = [...arr];
  const target = newArr[from];
  newArr.splice(from, 1);
  newArr.splice(to, 0, target);
  return [...newArr];
};
