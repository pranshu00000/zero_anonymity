import React from "react";

const Faq = () => {
  return (
    <div className="lg:ml-[200px] box-border">
      <h1 className="text-2xl font-bold lg:text-3xl lg:my-10 ">
        Frequently Asked Questions:
      </h1>
      <div className="my-2 lg:my-10">
        <p className="font-semibold lg:text-xl">
          Do I need to sign up to use Zero-Anonymity?
        </p>
        <p className="lg:text-lg">
          No sign-up is required! You can start chatting with strangers
          instantly without creating an account.
        </p>
      </div>
      <div className="my-2 lg:my-10">
        <p className="font-semibold lg:text-xl">
          What happens if I accidentally close the chat window?
        </p>
        <p className="lg:text-lg">
          No worries! You can simply refresh the page to start a new chat with a
          different person.
        </p>
      </div>
      <div className="my-2 lg:my-10">
        <p className="font-semibold lg:text-xl">
          Are there any rules for chatting?
        </p>
        <p className="lg:text-lg">
          Yes, we have some basic guidelines to ensure a positive experience for
          everyone. Be respectful and follow our community guidelines.
        </p>
      </div>
      <div className="my-2 lg:my-10">
        <p className="font-semibold lg:text-xl">Are my messages private?</p>
        <p className="lg:text-lg">
          Yes, your messages are private during the chat session. We don't store
          any conversation history.
        </p>
      </div>
      <div className="my-2 lg:my-10">
        <p className="font-semibold lg:text-xl">
          Can I share images or other media in the chat?
        </p>
        <p className="lg:text-lg">
          Currently, Zero-Anonymity supports text-only conversations. We
          encourage users to focus on meaningful and engaging discussions.
        </p>
      </div>
    </div>
  );
};

export default Faq;
