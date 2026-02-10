import os
from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        path = os.path.abspath("index.html")
        page.goto(f"file://{path}")
        page.set_viewport_size({"width": 1280, "height": 720})
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/initial.png")
        browser.close()

if __name__ == "__main__":
    verify()
