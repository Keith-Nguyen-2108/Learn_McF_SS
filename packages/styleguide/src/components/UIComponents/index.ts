import DaterangeFilter from "./DaterangeFilter.vue";
import DatePicker from "./DatePicker.vue";
import SelectInput from "./SelectInput.vue";
import TextareaInput from "./TextareaInput.vue";
import TextInput from "./TextInput.vue";

const win = window as any;

win.LearnSSStyleGuide = {
  SelectInput,
} as any;

export { DatePicker, DaterangeFilter, TextInput, SelectInput, TextareaInput };
