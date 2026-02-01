export default {
  name: "Rule34Videos",
  version: "1.0.0",
  author: "Custom",
  lang: "en",
  baseUrl: "https://rule34video.com",

  async search(query, page = 1) {
    const res = await fetch(`${this.baseUrl}/?s=${encodeURIComponent(query)}&paged=${page}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return [...doc.querySelectorAll(".thumb")].map(el => {
      const a = el.querySelector("a");
      const img = el.querySelector("img");
      return {
        title: a?.getAttribute("title") || "Rule34 Video",
        url: a?.href,
        thumbnail: img?.src || ""
      };
    }).filter(v => v.url);
  },

  async latest(page = 1) {
    return this.search("", page);
  },

  async getVideo(url) {
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const src = doc.querySelector("video source")?.src;

    if (!src) throw new Error("Video not found");

    return { video: src, type: "mp4" };
  }
};
