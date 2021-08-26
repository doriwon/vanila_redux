import { createStore } from "redux";
const form = document.querySelector("form");
const input = document.querySelector("input");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DELETE_TODO = "DELETE_TODO";

//action만을 return하는 함수 생성 <- 코드 촤적화 방법 (보통 reducer위에 작성)
const addToDo = (text) => {
  return { type: ADD_TODO, text };
};

const deleteToDo = (id) => {
  return { type: DELETE_TODO, id };
};

const reducer = (state = [], action) => {
  //state = [] : 비어있는 배열로 초기화
  console.log(action);
  switch (action.type) {
    case ADD_TODO:
      const newToDoObj = { text: action.text, id: Date.now() };
      return [newToDoObj, ...state]; //순서 변경 가능 (새로 입력시 목록 맨위로 작성됨)
    //state.push(action.text) <- 이러한 state mutate 절대 금지
    //spread 연산자 : 모든 배열의 컨텐츠가 열림 (array 대신 content) 을 사용함으로서 새로운 object로 array를 만듦
    case DELETE_TODO:
      const cleaned = state.filter((toDo) => toDo.id !== action.id); //filter : 샥제하고자 하는 id값 제외하고 새로운 배열 생성
      return cleaned;
    default:
      return state;
  }
}; //toDos array를 수정하지 않고 새로운 배열을 만들어서 사용

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

const dispatchAddToDo = (text) => {
  store.dispatch(addToDo(text));
};

const dispatchDeleteToDo = (e) => {
  const id = parseInt(e.target.parentNode.id); //해당 버튼의 부모요소 li의 id값 구하기
  //console.log("id", typeof id); //parseInt으로 string -> number로 변경
  store.dispatch(deleteToDo(id));
};

const paintToDos = () => {
  const toDos = store.getState();
  ul.innerHTML = ""; //추가할 때마다 모든 목록이 repainting됨을 방지하기 위해
  toDos.forEach((toDo) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.addEventListener("click", dispatchDeleteToDo);
    li.id = toDo.id;
    li.innerHTML = toDo.text;
    li.appendChild(btn);
    ul.appendChild(li);
  });
};

store.subscribe(paintToDos); //toDo의 변화에 맞게 list를 repainting

const onSubmit = (e) => {
  e.preventDefault();
  const toDo = input.value;
  input.value = "";
  dispatchAddToDo(toDo);
};

form.addEventListener("submit", onSubmit);
