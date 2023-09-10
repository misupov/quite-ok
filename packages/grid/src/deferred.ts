export function deferred(callback: () => void): () => void {
  let messagePosted = false;
  return () => {
    if (!messagePosted) {
      queueMicrotask(callback);
      messagePosted = true;
      requestAnimationFrame(() => {
        messagePosted = false;
      });
    }
  };
}
