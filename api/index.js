export default function handler(req, res) {
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>It works</h1>");
}
