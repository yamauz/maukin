<template>
  <c-box
    class="item-label"
    fontSize="xs"
    px="4px"
    borderRadius="6px"
    :style="{ background: background, color: color }"
    :id="objId"
    tabindex="0"
    @keydown.right="focusNext"
    @keydown.left="focusPrev"
    @keydown.space="focusItem"
    @keyup.enter="fireEvent"
  >
    <c-flex align="center">
      <c-box pr="4px" bg="red">
        <v-icon :name="icon" scale="0.7" />
      </c-box>
      <Highlighter
        class="highlight-label"
        highlightClassName="highlight"
        :searchWords="searchWords"
        :autoEscape="true"
        :textToHighlight="value"
        :caseSensitive="false"
        :diacriticsSensitive="false"
      />
    </c-flex>
  </c-box>
</template>

<script>
import { CBadge, CBox, CFlex } from "@chakra-ui/vue";
import Highlighter from "vue-highlight-words";
import { mapState, mapActions } from "vuex";
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";

export default {
  name: "ItemLabel",
  components: {
    CBadge,
    CBox,
    CFlex,
    "v-icon": Icon,
    Highlighter,
  },
  props: {
    variantColor: String,
    value: String,
    type: String,
    objId: String,
    itemId: String,
    labelObjIds: Array,
  },
  computed: {
    ...mapState(["filterKey"]),
    searchWords() {
      if (!this.filterKey) {
        return [];
      } else {
        if (this.filterKey.type !== "hash") return [];
        return this.filterKey.value.split(" ");
      }
    },
    background: function() {
      switch (this.type) {
        case "hash":
          return "#a4bd00";
        case "map":
          return "#005dbd";
        case "limit":
          return "#980d27";
        case "progress":
          return "#0d9825";
        default:
          return "red";
      }
    },
    color: function() {
      switch (this.type) {
        case "hash":
          return "#33351c";
        case "map":
          return "#c6cdf9";
        case "limit":
          return "#c1aeae";
        case "progress":
          return "#bbe4b8";
        default:
          return "black";
      }
    },
    icon: function() {
      switch (this.type) {
        case "hash":
          return "hashtag";
        case "map":
          return "map-marker-alt";
        case "limit":
          return "clock";
        case "progress":
          return "percent";
        default:
          return "circle";
      }
    },
  },
  methods: {
    ...mapActions(["setFilterKey"]),
    focusNext() {
      const current = document.activeElement.id;
      if (this.labelObjIds.length === 1) {
        return;
      } else {
        const currentIndex = this.labelObjIds.findIndex((id) => id === current);
        if (currentIndex + 1 === this.labelObjIds.length) {
          const target = document.getElementById(this.labelObjIds[0]);
          target.focus();
        } else {
          const target = document.getElementById(
            this.labelObjIds[currentIndex + 1]
          );
          target.focus();
        }
      }
    },
    focusPrev() {
      const current = document.activeElement.id;
      if (this.labelObjIds.length === 1) {
        return;
      } else {
        const currentIndex = this.labelObjIds.findIndex((id) => id === current);
        if (currentIndex - 1 === -1) {
          const target = document.getElementById(
            this.labelObjIds[this.labelObjIds.length - 1]
          );
          target.focus();
        } else {
          const target = document.getElementById(
            this.labelObjIds[currentIndex - 1]
          );
          target.focus();
        }
      }
    },
    focusItem(e) {
      e.stopPropagation();
      document.getElementById(this.itemId).focus();
    },
    fireEvent(e) {
      console.log("fire-event");
      e.stopPropagation();
      switch (this.type) {
        case "map": {
          console.log("this.value", this.value);
          const googleMapUrl = "https://maps.google.co.jp/maps?q=";
          const location = this.value;
          const url = `${googleMapUrl}${location}`;
          window.open(url, "_blank");
          break;
        }
        case "hash": {
          this.setFilterKey({
            type: this.type,
            value: this.value,
            selectFromTag: true,
          });
          document.getElementsByClassName("ti-new-tag-input")[0].focus();
          break;
        }
        default:
          break;
      }
    },
  },
};
</script>

<style>
.highlight-label {
  font-size: 7px;
}
</style>
