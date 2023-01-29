import { useEffect, useState } from "react";
import { Trash } from "phosphor-react";
import uuid from "react-uuid";
import app from "./api/items";

interface form {
  title: string;
  price: string;
  amount: string;
  createdAt?: Date | undefined;
}

interface listProps extends form {
  id: string;
}

export function App() {
  const [list, setList] = useState<listProps[]>([]);
  const [updateList, setUpdateList] = useState(false);
  const [count, setCount] = useState(0);
  const [countItems, setCountItems] = useState(0);
  const [formState, setFormState] = useState<form>({
    title: "",
    price: "",
    amount: "",
    createdAt: undefined,
  });

  async function returnItems() {
    try {
      await app
        .get("items?_sort=createdAt&_order=desc")
        .then((response) => {
          setList(response.data);

          let newCount = 0;
          let newCountItems = 0;

          response.data.forEach((item: listProps) => {
            newCount += Number(item.price) * Number(item.amount);
            newCountItems += 1;
          });

          setCount(newCount);
          setCountItems(newCountItems);
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  }

  async function addItems() {
    const data: listProps = {
      id: uuid(),
      title: formState.title,
      price: formState.price,
      amount: formState.amount,
      createdAt: new Date(),
    };

    try {
      await app
        .post("items", data)
        .then(() => {
          document.getElementById("item")?.focus();

          setFormState({
            title: "",
            amount: "",
            price: "",
          });

          setUpdateList(!updateList);
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteItem(id: string) {
    try {
      await app
        .delete(`items/${id}`)
        .then(() => {
          setUpdateList(!updateList);
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    returnItems();
  }, [updateList]);
  return (
    <>
      <div className="flex justify-center items-center w-screen h-[20vh]">
        <h1 className="text-white font-bold text-2xl uppercase">
          Lista supermercado
        </h1>
      </div>

      <div className="w-screen h-auto px-4">
        {/* Form */}
        <form>
          <div className="max-w-[780px] w-full h-auto flex items-center justify-center gap-2 mx-auto mt-[-20px]">
            <input
              type="text"
              placeholder="Adicionar um item ..."
              className=" outline-none px-4 py-3 rounded w-full"
              value={formState.title}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  title: event.currentTarget?.value,
                })
              }
              id="item"
            />

            <input
              type="text"
              placeholder="R$ 0.00"
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
              className="rounded px-2 py-3 text-center w-20"
              value={formState.price}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  price: event.currentTarget?.value,
                })
              }
              id="price"
            />

            <input
              type="text"
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
              placeholder="0"
              className="rounded px-2 py-3 w-14 text-center"
              value={formState.amount}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  amount: event.currentTarget?.value,
                })
              }
              id="amount"
            />
            <button
              type="submit"
              onSubmit={(event) => {
                event.preventDefault();
                addItems();
              }}
              className="px-2 py-3 text-white bg-green-100 hover:bg-green-200 transition-all rounded disabled:cursor-not-allowed disabled:bg-green-200 disabled:text-gray-500"
              onClick={addItems}
              disabled={
                !formState.amount || !formState.title || !formState.price
              }
            >
              adicionar
            </button>
          </div>
        </form>

        {/* Content */}
        <div className="max-w-[780px] w-full h-auto flex flex-col items-center justify-center gap-2 mx-auto mt-16">
          <div className="flex justify-between items-center w-full border-b border-dashed pb-2 mb-4">
            <p className="ext-base font-bold">
              Total itens:{" "}
              <span className="bg-gray-600 p-1 rounded-full">{countItems}</span>
            </p>
            <p className="text-base font-bold">
              Total:{" "}
              <span className="text-3xl ml-2 text-green-100">R$ {count}</span>
            </p>
          </div>
          {list.map((item) => {
            return (
              <div className="w-full flex gap-2" key={item.id}>
                <input
                  disabled
                  type="text"
                  className="px-4 py-2 rounded w-full"
                  value={item.title}
                  id="item"
                />

                <input
                  disabled
                  type="text"
                  className="rounded p-2 w-24 text-center"
                  value={"R$" + " " + item.price}
                  id="price"
                />
                <input
                  disabled
                  type="text"
                  placeholder="0"
                  className="rounded p-2 w-20 text-center"
                  value={item.amount}
                  id="amount"
                />
                <button
                  className="p-2 text-white bg-red-100 hover:bg-red-200 rounded disabled:cursor-not-allowed disabled:bg-purple-300 disabled:text-gray-500"
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash size={22} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
