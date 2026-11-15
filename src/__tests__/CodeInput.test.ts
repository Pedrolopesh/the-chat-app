import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { ref } from "vue";
import CodeInput from "@/components/ui/CodeInput.vue";

describe("CodeInput", () => {
  it("aceita o código colado inteiro e avisa quando completa", async () => {
    const model = ref("");
    const w = mount(CodeInput, {
      props: { modelValue: model.value, "onUpdate:modelValue": (v: string) => (model.value = v) },
    });
    const event = new Event("paste") as Event & { clipboardData: { getData: () => string } };
    Object.defineProperty(event, "clipboardData", { value: { getData: () => "12 34 56" } });
    w.element.dispatchEvent(event);
    expect(model.value).toBe("123456");
    expect(w.emitted("complete")?.[0]).toEqual(["123456"]);
  });

  it("ignora o que não é dígito", async () => {
    const model = ref("");
    const w = mount(CodeInput, {
      props: { modelValue: model.value, "onUpdate:modelValue": (v: string) => (model.value = v) },
    });
    const first = w.findAll("input")[0]!;
    await first.setValue("a");
    expect(model.value).toBe("");
    expect(w.emitted("complete")).toBeUndefined();
  });
});
