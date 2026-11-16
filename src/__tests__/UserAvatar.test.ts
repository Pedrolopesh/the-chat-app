import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import UserAvatar from "@/components/ui/UserAvatar.vue";

describe("UserAvatar", () => {
  it("só usa imagem https; senão mostra as iniciais", () => {
    expect(mount(UserAvatar, { props: { name: "Ana Paula", src: "https://cdn/x.png" } }).find("img").exists()).toBe(true);
    const bad = mount(UserAvatar, { props: { name: "Ana Paula", src: "javascript:alert(1)" } });
    expect(bad.find("img").exists()).toBe(false);
    expect(bad.text()).toBe("AP");
  });
});
