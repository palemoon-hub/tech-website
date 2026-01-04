const contactEmail = "qqwslhj123321@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
    const emailLinks = document.querySelectorAll('.email-link');
    emailLinks.forEach(link => {
        link.href = `mailto:${contactEmail}`;
    });
});
