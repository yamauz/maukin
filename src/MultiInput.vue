<template>
  <c-box py="2">
    <vue-tags-input
      v-model="tag"
      :tags="searchOptionTag"
      @before-adding-tag="checkTag"
      @before-deleting-tag="deleteTag"
      :delete-on-backspace="true"
      placeholder="/: 本文検索 #: ハッシュタグ検索"
    />
  </c-box>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { CBox, CButton, CFlex, CInput } from "@chakra-ui/vue";
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  name: "EditInput",
  components: { VueTagsInput, CBox },
  props: {},
  data() {
    return {
      // selected: null,
      options: [],
      tag: "",
      tags: [],
      test: "",
    };
  },
  watch: {
    changeFilterToken() {
      const optionTag = [{ text: "#", tiClasses: ["ti-valid"] }];
      this.setSearchOptionTag(optionTag);
      this.tag = this.filterKey.value;
    },
    clearFitlerToken() {
      console.log("filter cleared");
      this.setSearchOptionTag([]);
      this.tag = "";
      document.getElementsByClassName("ti-new-tag-input")[0].focus();
    },
    tag: function(value) {
      // 最初に打った文字をチェック
      // サーチオプションキーだった場合
      let optionTag;
      switch (value[0]) {
        case "/": {
          optionTag = [{ text: "/", tiClasses: ["ti-valid"] }];
          this.setSearchOptionTag(optionTag);
          setTimeout(() => {
            this.tag = "";
          }, 0);
          return;
        }
        case "#": {
          optionTag = [{ text: "#", tiClasses: ["ti-valid"] }];
          this.setSearchOptionTag(optionTag);
          setTimeout(() => {
            this.tag = "";
          }, 0);
          return;
        }
        default:
          break;
      }
      // サーチオプションキーかつそれ以降の文字列チェック
      if (this.searchOptionTag.length === 1) {
        let filterKey;
        switch (this.searchOptionTag[0].text) {
          case "/":
            filterKey = { type: "text", value: this.tag };
            break;
          case "#":
            filterKey = { type: "hash", value: this.tag };
            break;
          default:
            break;
        }
        this.setFilterKey(filterKey);
      }
    },
  },
  computed: {
    ...mapState([
      "items",
      "inputTags",
      "searchOptionTag",
      "changeFilterToken",
      "clearFitlerToken",
      "filterKey",
    ]),
  },
  methods: {
    ...mapActions([
      "setTags",
      "addItem",
      "clearTags",
      "focusOnItemList",
      "setFilterKey",
      "setSearchOptionTag",
      "focusOnMultiInput",
    ]),
    deleteTag() {
      this.setSearchOptionTag([]);
      this.setFilterKey(null);
    },
    checkTag(obj) {
      if (this.searchOptionTag.length === 1) {
        switch (this.searchOptionTag[0].text) {
          case "/":
          case "#":
            return null;
          default:
            break;
        }
      } else {
        this.addItem(obj.tag.text);
        this.tag = "";
      }
    },
  },
};
</script>

<style>
.ti-input {
  background: #000000;
  border: solid 1px #292d36 !important;
}

.ti-new-tag-input {
  background: #000000;
}
.ti-new-tag-input::placeholder {
  color: #a8aebd !important;
}
</style>
