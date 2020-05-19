import * as React from "react";
import { ChangeEvent, FC, useState } from "react";
import { genTestData, State } from "./util";
import { Dnd } from "./Dnd";

// ______________________________________________________
//
// @ View
//
export const App: FC = () => {
  const [list, setList] = useState<State>(genTestData(10));
  const [inputNum, setInputNum] = useState<number>(10);

  const change = (ev: ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(ev.target.value, 10);
    setInputNum(num);
  };

  const update = () => {
    const list = genTestData(inputNum);
    setList(list);
  };

  return (
    <section>
      <div className="input-section">
        <input
          type="number"
          onChange={change}
          value={inputNum}
          min={1}
          max={10000}
        />
        <button onClick={update}>UPDATE</button>
      </div>

      <Dnd list={list} setList={setList} />
    </section>
  );
};
