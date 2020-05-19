import * as React from "react";
import {
  DragEvent,
  FC,
  SyntheticEvent,
  TouchEvent,
  useEffect,
  useRef,
} from "react";
import { arrayMove, State } from "./util";

// ______________________________________________________
//
// @ Types
//
type DragHandler = (id: string) => (ev: DragEvent<HTMLDivElement>) => void;
type DragHandlers = {
  start: DragHandler;
  enter: DragHandler;
  end: DragHandler;
};

type TouchHandler = (id: string) => (ev: TouchEvent<HTMLDivElement>) => void;
type TouchHandlers = {
  start: TouchHandler;
  move: TouchHandler;
  end: TouchHandler;
};

type Props = {
  list: State;
  setList: (list: State) => void;
};

// ______________________________________________________
//
// @ View
//
export const DnD: FC<Props> = (props) => {
  const { list, setList } = props;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const draggingElmId = useRef<string | null>(null);
  const listClone = useRef<State>(list);

  useEffect(() => {
    listClone.current = list;
  }, [list]);

  useEffect(() => {
    if (!itemsRef.current || !listClone.current) return;
    listClone.current.map((item) => {
      itemsRef.current[item.id]?.addEventListener("touchmove", (ev) =>
        ev.preventDefault()
      );
    });
  }, [itemsRef]);

  const onDrag: DragHandlers = {
    // onDragStart
    start: (id) => (ev) => {
      draggingElmId.current = id;
      ev.dataTransfer.effectAllowed = "move";
      requestAnimationFrame(() => {
        itemsRef.current[id]?.classList.add("list-item-dragging");
      });
    },
    // onDragEnter
    enter: (id) => (ev) => {
      const containerElm = containerRef.current;
      if (!containerElm) return;
      if (!draggingElmId.current || !containerElm) return;

      const draggingElm = itemsRef.current[draggingElmId.current];
      const underElm = itemsRef.current[id];
      if (!underElm || !draggingElm || underElm === draggingElm) return;

      const draggingElmIndex = listClone.current.findIndex(
        (item) => item.id === draggingElmId.current
      );
      const underElmIndex = listClone.current.findIndex(
        (item) => item.id === id
      );

      if (draggingElmIndex === underElmIndex) {
        return;
      } else if (draggingElmIndex < underElmIndex) {
        containerElm.insertBefore(underElm, draggingElm);
      } else if (draggingElmIndex > underElmIndex) {
        containerElm.insertBefore(draggingElm, underElm);
      }

      listClone.current = arrayMove(
        listClone.current,
        draggingElmIndex,
        underElmIndex
      );
    },
    // onDragEnd
    end: (id) => (ev) => {
      itemsRef.current[id]?.classList.remove("list-item-dragging");
      setList(listClone.current);
    },
  };

  const onTouch: TouchHandlers = {
    start: (id) => (ev) => {
      draggingElmId.current = id;
      requestAnimationFrame(() => {
        itemsRef.current[id]?.classList.add("list-item-dragging");
      });
    },
    move: (id) => (ev) => {
      const containerElm = containerRef.current;
      const draggingElm = itemsRef.current[id];
      if (!containerElm || !draggingElm) return;

      const { clientX, clientY } = ev.targetTouches[0];
      const underElm = document.elementFromPoint(clientX, clientY);
      if (!underElm || draggingElm === underElm) return;

      const underElmId = underElm.getAttribute("data-id");
      if (!underElmId) return;

      const draggingElmIndex = listClone.current.findIndex(
        (item) => item.id === draggingElmId.current
      );
      const underElmIndex = listClone.current.findIndex(
        (item) => item.id === underElmId
      );
      if (draggingElmIndex === underElmIndex) {
        return;
      } else if (draggingElmIndex < underElmIndex) {
        containerElm?.insertBefore(underElm, draggingElm);
      } else if (draggingElmIndex > underElmIndex) {
        containerElm?.insertBefore(draggingElm, underElm);
      }

      listClone.current = arrayMove(
        listClone.current,
        draggingElmIndex,
        underElmIndex
      );
    },

    end: (id) => (ev) => {
      itemsRef.current[id]?.classList.remove("list-item-dragging");
      setList(listClone.current);
    },
  };

  const preventDefaultEvent = (ev: SyntheticEvent) => ev.preventDefault();

  return (
    <div
      className="container"
      ref={containerRef}
      onDrop={preventDefaultEvent}
      onDragOver={preventDefaultEvent}
      onDragEnter={preventDefaultEvent}
    >
      {list.map((item) => (
        <div
          key={item.id}
          className="list-item"
          data-id={item.id}
          ref={(elm) => (itemsRef.current[item.id] = elm)}
          draggable
          onDragStart={onDrag.start(item.id)}
          onDragEnter={onDrag.enter(item.id)}
          onDragEnd={onDrag.end(item.id)}
          onDragOver={preventDefaultEvent}
          onDrop={preventDefaultEvent}
          onTouchStart={onTouch.start(item.id)}
          onTouchMove={onTouch.move(item.id)}
          onTouchEnd={onTouch.end(item.id)}
        >
          {item.value}
        </div>
      ))}
    </div>
  );
};
