import Vue from "vue";
import Vuex from "vuex";
import shortid from "shortid";
import arraySort from "array-sort";
import dayjs from "dayjs";

Vue.use(Vuex);

const createTextObj = (origText) => {
  // const splitText = origText.split(
  //   /(@[\S@#!%]+|#[\S@#!%]+|![\S@#!%]+|%[\S@#!%]+)/g
  // );
  const splitText = origText.split(" ");
  const textObj = splitText.map((txt) => {
    let type;
    switch (txt[0]) {
      case "@":
        type = "map";
        break;
      case "#":
        type = "hash";
        break;
      case "!":
        type = "limit";
        break;
      case "%":
        type = "progress";
        break;
      default:
        type = "plain";
        break;
    }
    const textConverted = type === "plain" ? txt : txt.substr(1);

    return {
      id: `obj-${shortid.generate()}`,
      type,
      txt: textConverted,
    };
  });

  return textObj;
};

const sampleItems = [
  {
    id: shortid.generate(),
    createdAt: dayjs().unix(),
    origText: "ようこそ！これはサンプルアイテムです。 #マウ禁TODO",
    textObj: createTextObj(
      "ようこそ！これはサンプルアイテムです。 #マウ禁TODO"
    ),
  },
  {
    id: shortid.generate(),
    createdAt: dayjs().unix(),
    origText:
      "@東京タワー マップリンクが作成可能です。Spaceキーでタグにフォーカス。 ",
    textObj: createTextObj(
      "@東京タワー マップリンクが作成可能です。Spaceキーでタグにフォーカス。 "
    ),
  },
  {
    id: shortid.generate(),
    createdAt: dayjs().unix(),
    origText: "ハッシュタグを付けることが可能です。 #Test #買い物",
    textObj: createTextObj(
      "ハッシュタグを付けることが可能です。 #Test #買い物"
    ),
  },
  {
    id: shortid.generate(),
    createdAt: dayjs().unix(),
    origText: "%70 進捗メータを背景に表示可能です。",
    textObj: createTextObj("%70 進捗メータを背景に表示可能です。"),
  },
  {
    id: shortid.generate(),
    createdAt: dayjs().unix(),
    origText: "!10m リミットメータが表示可能です。(100s, 5m, 1h, 20210908 etc)",
    textObj: createTextObj(
      "!10m リミットメータが表示可能です。(100s, 5m, 1h, 20210908 etc)"
    ),
  },
];

const getfilteredItems = (filterKey, items) => {
  if (!filterKey) return items;

  switch (filterKey.type) {
    case "hash": {
      const filteredItems = items.filter((item) =>
        item.textObj.some(
          (obj) => obj.type === "hash" && obj.txt.includes(filterKey.value)
        )
      );
      return filteredItems;
    }
    case "text": {
      if (filterKey.value === "") return items;
      const filteredItems = items.filter((item) =>
        item.textObj.some(
          (obj) =>
            obj.type === "plain" &&
            filterKey.value.split(" ").every((val) => obj.txt.includes(val))
        )
      );
      return filteredItems;
    }
    default:
      break;
  }
};

export default new Vuex.Store({
  state: {
    isTextColor: false,
    test: "hello!",
    count: 0,
    items: sampleItems,
    filterKey: null,
    newTodoInputValue: "",
    textObj: [],
    editItemInputValue: "",
    editId: "",
    inputTags: [],
    searchOptionTag: [],
    changeFilterToken: "",
    clearFitlerToken: "",
  },
  getters: {
    filteredItems: (state) => {
      return getfilteredItems(state.filterKey, state.items);
    },
  },
  mutations: {
    addItem(state, item) {
      const origText = item;
      if (origText === "") return;
      const id = shortid.generate();
      const createdAt = dayjs().unix();
      const textObj = createTextObj(origText);
      state.items.push({ id, createdAt, origText, textObj });
      state.newTodoInputValue = "";
    },
    sortItem(state, key) {
      state.items = arraySort(state.items, key);
    },
    setEditId(state, itemId) {
      if (state.editId === "") {
        state.editId = itemId;
        const targetOrigText = state.items.filter(
          (item) => item.id === itemId
        )[0].origText;
        state.editItemInputValue = targetOrigText;
      } else {
        state.editId = "";
        // state.editItemInputValue = "";
      }
    },
    deleteItem(state, { item, index }) {
      const targetItemIndex = state.items.findIndex(
        (stateItem) => stateItem.id === item.id
      );

      state.items.splice(targetItemIndex, 1);
      const filteredItems = getfilteredItems(state.filterKey, state.items);
      switch (filteredItems.length) {
        case 0:
          document.getElementsByClassName("ti-new-tag-input")[0].focus();
          break;
        case 1:
          document.getElementById(filteredItems[0].id).focus();
          break;
        case index:
          document.getElementById(filteredItems[index - 1].id).focus();
          break;
        default:
          document.getElementById(filteredItems[index].id).focus();
          break;
      }
    },
    updateItem(state, itemId) {
      const targetItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );
      state.items[targetItemIndex].editedAt = dayjs().unix();
      state.items[targetItemIndex].origText = state.editItemInputValue;
      state.items[targetItemIndex].textObj = createTextObj(
        state.editItemInputValue
      );
      document.getElementById(state.items[targetItemIndex].id).focus();
    },
    setInputValue(state, text) {
      // const text = event.target.value;
      state.newTodoInputValue = text;
    },
    setEditItemInputValue(state, event) {
      const text = event.target.value;
      state.editItemInputValue = text;
    },
    setTags(state, value) {
      if (value === "/") {
        state.inputTags = [value];
      }
    },
    clearTags(state) {
      state.inputTags = [];
    },
    focusOnItemList(state) {
      if (state.items.length === 0) return;
      const itemList = document.getElementById(state.items[0].id);
      itemList.focus();
    },
    focusOnMultiInput() {
      document.getElementsByClassName("ti-new-tag-input")[0].focus();
    },
    setFilterKey(state, filterKey) {
      if (filterKey === null) {
        state.clearFitlerToken = shortid.generate();
      }
      if (filterKey?.selectFromTag) {
        state.changeFilterToken = shortid.generate();
      }
      state.filterKey = filterKey;
    },
    setSearchOptionTag(state, tag) {
      state.searchOptionTag = tag;
    },
  },
  actions: {
    addItem(store, item) {
      return store.commit("addItem", item);
    },
    sortItem(store, key) {
      return store.commit("sortItem", key);
    },
    deleteItem(store, obj) {
      return store.commit("deleteItem", obj);
    },
    updateItem(store, itemId) {
      return store.commit("updateItem", itemId);
    },
    setEditId(store, itemId) {
      return store.commit("setEditId", itemId);
    },

    setInputValue(store, text) {
      return store.commit("setInputValue", text);
    },
    setTags(store, value) {
      return store.commit("setTags", value);
    },
    clearTags(store) {
      return store.commit("clearTags");
    },
    setEditItemInputValue(store, event) {
      return store.commit("setEditItemInputValue", event);
    },
    focusOnItemList(store) {
      return store.commit("focusOnItemList");
    },
    focusOnMultiInput(store, e) {
      e.preventDefault();
      e.stopPropagation();
      return store.commit("focusOnMultiInput");
    },
    setFilterKey(store, filterKey) {
      return store.commit("setFilterKey", filterKey);
    },
    setSearchOptionTag(store, tag) {
      return store.commit("setSearchOptionTag", tag);
    },
  },
});
