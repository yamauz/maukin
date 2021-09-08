<template>
  <c-input
    class="edit-input"
    :id="'input-' + itemId"
    :value="editItemInputValue"
    @keydown="stopPropagation"
    @keydown.enter="updateItem(itemId)"
    @keydown.tab.prevent
    @keyup.tab.prevent
    @keyup.esc.prevent
    @keyup.esc.stop
    @blur="updateItem(itemId)"
    @change="setEditItemInputValue"
  />
</template>

<script>
import { mapState, mapActions } from "vuex";
import { CBox, CButton, CFlex, CInput } from "@chakra-ui/vue";
import GlobalEvents from "vue-global-events";
import { FocusTrap } from "focus-trap-vue";

export default {
  name: "EditInput",
  components: {
    CBox,
    CButton,
    CFlex,
    GlobalEvents,
    CInput,
    FocusTrap,
  },
  props: {
    itemId: String,
    itemIndex: Number,
    value: String,
  },
  data() {
    return {
      isActive: false,
    };
  },
  mounted: function() {
    document.getElementById(`input-${this.itemId}`).focus();
  },
  computed: {
    ...mapState(["items", "editItemInputValue", "editId"]),
  },
  methods: {
    ...mapActions(["updateItem", "setEditItemInputValue"]),
    stopPropagation(e) {
      e.stopPropagation();
    },
  },
};
</script>

<style>
.edit-input {
  border-radius: 2px;
  height: 32px;
  padding-left: 9px;
  font-size: 14px;
  background: black;
}
</style>
