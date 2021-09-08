<template>
  <c-box p="2">
    <GlobalEvents :filter="filterOnEnter" @keyup.enter="focusOnNewItemInput" />
    <c-flex justify="center" fontSize="xl" p="2" color="red.400"
      >マウ禁TODO</c-flex
    >
    <c-box fontSize="sm">マウス操作ができません。</c-box>
    <c-box fontSize="sm"
      >エンターキーでインプットにフォーカスしてTODOを入力しましょう</c-box
    >
    <c-box fontSize="sm">タブキーでアイテムリストにフォーカスします。</c-box>
    <c-box fontSize="sm">リスト上エンターで編集できます</c-box>
    <!-- <c-button @click="sortItem('createdAt')">sort by createdAt</c-button> -->
    <!-- <c-button @click="sortItem('origText')">sort by text</c-button> -->
    <!-- <c-button @click="setFilterKey(null)">clear filter</c-button> -->
    <!-- <c-button @click="showToast">Show Toast</c-button> -->
    <MultiInput />

    <c-box v-if="items.length !== 0" id="item-list" bg="#0d1016" p="1">
      <c-box
        tabindex="0"
        w="100%"
        v-for="(item, index) in filteredItems"
        pos="relative"
        :key="item.id"
        :id="item.id"
        @keydown.down="selectNext($event, index)"
        @keydown.up="selectPrev($event, index)"
        @keydown.delete="deleteItem({ item, index })"
        @keydown.tab="focusOnMultiInput"
        @keydown.space="focusOnTags(item.textObj)"
        @keyup.enter="setEditId(item.id)"
        @keyup.esc="setFilterKey(null)"
        overflow="hidden"
      >
        <c-flex align="left" h="100%" w="100%">
          <ProgressBar
            v-if="item.textObj.some((obj) => obj.type === 'progress')"
            :item="item"
          />
          <c-Box v-if="editId === item.id" w="100%">
            <EditInput
              :itemId="item.id"
              :itemIndex="index"
              :value="item.origText"
            />
          </c-Box>
          <c-box v-else w="100%" h="100%" class="item-badge">
            <c-stack
              isInline
              :spacing="1"
              align="center"
              h="100%"
              py="1"
              pl="2"
            >
              <span
                :style="{ whiteSpace: 'pre' }"
                v-for="(obj, index) in item.textObj"
                :key="index"
              >
                <ItemLabel
                  v-if="['map', 'hash', 'limit', 'progress'].includes(obj.type)"
                  :objId="obj.id"
                  :itemId="item.id"
                  :value="obj.txt"
                  :type="obj.type"
                  :labelObjIds="labelObjIds"
                />
                <!-- <span v-if="['plain'].includes(obj.type)">{{ obj.txt }}</span> -->
                <c-box
                  as="span"
                  fontSize="sm"
                  v-if="['plain'].includes(obj.type)"
                >
                  <Highlighter
                    class="my-highlight"
                    highlightClassName="highlight"
                    :searchWords="searchWords"
                    :autoEscape="true"
                    :textToHighlight="obj.txt"
                  />
                </c-box>
              </span>
            </c-stack>
          </c-box>
          <LimitBar
            v-if="item.textObj.some((obj) => obj.type === 'limit')"
            :item="item"
            :editedAt="item.editedAt"
          />
        </c-flex>
      </c-box>
    </c-box>
  </c-box>
</template>

<script>
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import { mapState, mapActions, mapGetters } from "vuex";
import {
  CStack,
  CProgress,
  CBox,
  CButton,
  CBadge,
  CFlex,
  CInput,
} from "@chakra-ui/vue";
import GlobalEvents from "vue-global-events";
import EditInput from "./EditInput.vue";
import MultiInput from "./MultiInput.vue";
import ItemLabel from "./ItemLabel.vue";
import LimitBar from "./LimitBar.vue";
import ProgressBar from "./ProgressBar.vue";
import Highlighter from "vue-highlight-words";

export default {
  name: "App",
  components: {
    "v-icon": Icon,
    CStack,
    CBox,
    CButton,
    CBadge,
    CFlex,
    CProgress,
    GlobalEvents,
    CInput,
    EditInput,
    MultiInput,
    ItemLabel,
    LimitBar,
    ProgressBar,
    Highlighter,
  },
  data() {
    return {
      labelObjIds: [],
    };
  },
  computed: {
    ...mapGetters(["filteredItems"]),
    ...mapState([
      "filterKey",
      "items",
      "newTodoInputValue",
      "editId",
      "textObj",
    ]),
    searchWords() {
      if (!this.filterKey) {
        return [];
      } else {
        if (this.filterKey.type !== "text") return [];
        return this.filterKey.value.split(" ");
      }
    },
  },
  methods: {
    ...mapActions([
      "setFilterKey",
      "addItem",
      "sortItem",
      "deleteItem",
      "setEditId",
      "setInputValue",
      "focusOnMultiInput",
    ]),
    filterOnEnter(event) {
      return event.target.tagName === "BODY";
    },
    focusOnNewItemInput() {
      const multiInput = document.getElementsByClassName("ti-new-tag-input")[0];
      multiInput.focus();
    },
    selectNext(e, index) {
      e.preventDefault();
      const row = index + 1;
      if (this.filteredItems.length === row) {
        document.getElementById(this.filteredItems[0].id).focus();
      } else {
        document.getElementById(this.filteredItems[row].id).focus();
      }
    },
    selectPrev(e, index) {
      e.preventDefault();
      const row = index + 1;
      if (row === 1) {
        document
          .getElementById(this.filteredItems[this.filteredItems.length - 1].id)
          .focus();
      } else {
        document.getElementById(this.filteredItems[index - 1].id).focus();
      }
    },
    showToast() {
      this.$toast({
        title: "Account created.",
        description: "We've created your account for you.",
        position: "bottom-right",
        status: "info",
        duration: 1000,
        variant: "subtle", // `solid` | `subtle` | `top-accent` | `left-accent`
      });
    },
    focusOnTags(textObj) {
      this.labelObjIds = textObj
        .filter((obj) => obj.type !== "plain")
        .map((obj) => obj.id);
      if (this.labelObjIds.length !== 0) {
        const target = document.getElementById(this.labelObjIds[0]);
        if (target) {
          target.focus();
        }
      }
    },
  },
};
</script>

<style>
body {
  box-sizing: border-box;
  pointer-events: none !important;
  background-color: #151515;
  color: #b3b8c5;
}

* {
  pointer-events: none !important;
}

.item {
  height: 40px;
  outline: none;
  background: snow;
  border: solid 1px transparent;
}

.item-badge {
  z-index: 100;
}
.item-badge:focus {
  border: solid 1px red;
}
.item:focus {
  border: solid 1px black;
}
</style>
