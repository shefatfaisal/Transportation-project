let divs = document.querySelectorAll("div:not(.container)");
[...divs].forEach((div, index) => {
  div.onclick = () => {
    let targetUrl = `bus-${index + 1}.html`;
    window.location = targetUrl;
  };
});