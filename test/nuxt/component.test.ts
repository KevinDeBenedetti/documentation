import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, h, ref } from "vue";

describe("component test examples", () => {
  it("can mount components", async () => {
    const TestComponent = defineComponent({
      setup() {
        return () => h("div", "Hello Nuxt!");
      },
    });

    const component = await mountSuspended(TestComponent);

    expect(component.text()).toBe("Hello Nuxt!");
  });

  it("can test components with props", async () => {
    const TestComponent = defineComponent({
      props: {
        title: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      setup(props) {
        return () => h("div", `${props.title}: ${props.count}`);
      },
    });

    const component = await mountSuspended(TestComponent, {
      props: {
        title: "Items",
        count: 5,
      },
    });

    expect(component.text()).toBe("Items: 5");
  });

  it("can test components with reactive state", async () => {
    const TestComponent = defineComponent({
      setup() {
        const count = ref(0);
        const increment = () => {
          count.value++;
        };

        return () =>
          h("div", [
            h("span", { "data-testid": "count" }, String(count.value)),
            h("button", { onClick: increment, "data-testid": "button" }, "Increment"),
          ]);
      },
    });

    const component = await mountSuspended(TestComponent);

    expect(component.find('[data-testid="count"]').text()).toBe("0");

    await component.find('[data-testid="button"]').trigger("click");

    expect(component.find('[data-testid="count"]').text()).toBe("1");
  });

  it("can test components with slots", async () => {
    const TestComponent = defineComponent({
      setup(_, { slots }) {
        return () => h("div", { class: "wrapper" }, slots.default?.());
      },
    });

    const component = await mountSuspended(TestComponent, {
      slots: {
        default: () => "Slot Content",
      },
    });

    expect(component.find(".wrapper").text()).toBe("Slot Content");
  });

  it("can test components with multiple children", async () => {
    const TestComponent = defineComponent({
      setup() {
        return () => h("div", [h("h1", "Title"), h("p", "Description"), h("footer", "Footer")]);
      },
    });

    const component = await mountSuspended(TestComponent);

    expect(component.find("h1").text()).toBe("Title");
    expect(component.find("p").text()).toBe("Description");
    expect(component.find("footer").text()).toBe("Footer");
  });

  it("can test components with conditional rendering", async () => {
    const TestComponent = defineComponent({
      props: {
        show: {
          type: Boolean,
          default: false,
        },
      },
      setup(props) {
        return () => h("div", [props.show ? h("p", "Visible") : h("p", "Hidden")]);
      },
    });

    const componentHidden = await mountSuspended(TestComponent, {
      props: { show: false },
    });
    expect(componentHidden.text()).toBe("Hidden");

    const componentVisible = await mountSuspended(TestComponent, {
      props: { show: true },
    });
    expect(componentVisible.text()).toBe("Visible");
  });

  it("can test components with computed values", async () => {
    const TestComponent = defineComponent({
      props: {
        firstName: String,
        lastName: String,
      },
      setup(props) {
        const fullName = () => `${props.firstName} ${props.lastName}`;

        return () => h("div", fullName());
      },
    });

    const component = await mountSuspended(TestComponent, {
      props: {
        firstName: "John",
        lastName: "Doe",
      },
    });

    expect(component.text()).toBe("John Doe");
  });
});
