export default {
  id: "rule34videos",
  name: "Rule34Videos",
  version: "1.0.1",
  author: "Local",
  lang: "en",
  type: "video",
  icon: "https://rule34video.com/favicon.ico",

  baseUrl: "https://rule34video.com",

  async home(page = 1) {
    return this.latest(page);
  },

  async latest(page = 1) {
    const res = await fetch(`${this.baseUrl}/page/${page}/`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return [...doc.querySelectorAll(".thumb")].map(el => {
      const a = el.querySelector("a");
      const img = el.querySelector("img");

      return {
        title: a?.getAttribute("title") ?? "Rule34 Video",
        url: a?.href ?? "",
        thumbnail: img?.src ?? ""
      };
    }).filter(v => v.url);
  },

  async search(query, page = 1) {
    const res = await fetch(`${this.baseUrl}/?s=${encodeURIComponent(query)}&paged=${page}`);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return [...doc.querySelectorAll(".thumb")].map(el => {
      const a = el.querySelector("a");
      const img = el.querySelector("img");

      return {
        title: a?.getAttribute("title") ?? "Rule34 Video",
        url: a?.href ?? "",
        thumbnail: img?.src ?? ""
      };
    }).filter(v => v.url);
  },

  async getVideo(url) {
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const src = doc.querySelector("video source")?.getAttribute("src");
    if (!src) throw new Error("Video source not found");

    return {
      video: src,
      type: "mp4"
    };
  }
};
