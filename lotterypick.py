from flask import Flask, render_template_string, request
import random

app = Flask(__name__)

PAGE = r"""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Random Number Generator</title>
  <style>
    :root { color-scheme: dark; --bg:#07111f; --panel:#101f33; --line:#263b55; --text:#edf4ff; --muted:#9fb1c9; --accent:#70d6c5; --blue:#8ab4ff; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif; background:radial-gradient(ellipse at top,#142d48 0,#07111f 55%); color:var(--text); min-height:100vh; }
    main { width:min(1000px,calc(100% - 32px)); margin:0 auto; padding:46px 0 56px; }
    .eyebrow { color:var(--accent); text-transform:uppercase; letter-spacing:.16em; font-size:.76rem; font-weight:800; }
    h1 { font-size:clamp(2.1rem,5vw,3.5rem); letter-spacing:-.04em; line-height:1.04; margin:12px 0; }
    .intro { color:var(--muted); max-width:700px; line-height:1.65; }
    .toolbar { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)) auto; gap:14px; align-items:end; background:var(--panel); border:1px solid var(--line); border-radius:18px; padding:18px; margin:28px 0 22px; }
    label { display:grid; gap:8px; color:var(--muted); font-size:.9rem; }
    input { width:100%; min-width:0; background:#081626; border:1px solid var(--line); border-radius:10px; padding:12px; color:var(--text); font:inherit; }
    button { border:0; border-radius:10px; padding:13px 18px; background:var(--accent); color:#06201d; font-weight:800; cursor:pointer; font:inherit; white-space:nowrap; }
    button:hover { filter:brightness(1.07); }
    .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:14px; }
    .card { background:linear-gradient(145deg,#13243a,#0d1a2b); border:1px solid var(--line); border-radius:18px; padding:18px; }
    .card h2 { margin:0 0 16px; color:var(--muted); font-size:.92rem; font-weight:700; }
    .balls { display:flex; flex-wrap:wrap; gap:8px; }
    .ball { min-width:42px; height:42px; padding:0 8px; display:grid; place-items:center; border-radius:50px; color:#07111f; font-weight:850; background:var(--text); box-shadow:inset 0 -3px 0 #b4c1d1; }
    .foot { margin-top:24px; padding:14px 16px; border:1px solid var(--line); border-radius:12px; color:var(--muted); font-size:.88rem; line-height:1.55; }
    .error { color:#ffb4b4; background:#351b27; border:1px solid #753347; border-radius:10px; padding:12px 14px; margin:0 0 18px; }
    @media(max-width:760px){ .toolbar{grid-template-columns:repeat(2,minmax(0,1fr))} .toolbar button{grid-column:1/-1} }
    @media(max-width:480px){ main{padding-top:30px}.toolbar{grid-template-columns:1fr} .toolbar button{grid-column:auto} }
  </style>
</head>
<body>
<main>
  <div class="eyebrow">Python · Randomness · Sampling</div>
  <h1>Random Number Generator</h1>
  <p class="intro">Choose how many numbers you want and the minimum and maximum values. Generate a fresh set whenever you like.</p>
  {% if error %}<p class="error" role="alert">{{ error }}</p>{% endif %}
  <form method="post" class="toolbar">
    <label>How many numbers?
      <input type="number" name="count" min="1" max="500" value="{{ count }}" required>
    </label>
    <label>Minimum number
      <input type="number" name="minimum" min="-1000000000" max="1000000000" value="{{ minimum }}" required>
    </label>
    <label>Maximum number
      <input type="number" name="maximum" min="-1000000000" max="1000000000" value="{{ maximum }}" required>
    </label>
    <button type="submit">Generate numbers ↗</button>
  </form>
  {% if samples is not none %}
  <section class="grid" aria-live="polite">
    <article class="card" style="grid-column:1/-1">
      <h2>{{ samples|length }} unique number{% if samples|length != 1 %}s{% endif %} from {{ minimum }} to {{ maximum }}</h2>
      <div class="balls">
        {% for n in samples %}<span class="ball">{{ n }}</span>{% endfor %}
      </div>
    </article>
  </section>
  {% endif %}
  <p class="foot">Numbers are selected randomly and without duplicates. The range includes both the minimum and maximum values. The number of requested values cannot exceed the number of available integers in the range.</p>
</main>
</body>
</html>
"""

def generate_numbers(count, minimum, maximum):
    if minimum > maximum:
        raise ValueError("Minimum number must be less than or equal to maximum number.")
    available = maximum - minimum + 1
    if count > available:
        raise ValueError(
            f"You requested {count} unique numbers, but this range contains only {available} numbers."
        )
    return sorted(random.sample(range(minimum, maximum + 1), count))

@app.route("/", methods=["GET", "POST"])
def index():
    count, minimum, maximum = 6, 1, 37
    samples = None
    error = None
    if request.method == "POST":
        try:
            count = int(request.form.get("count", "6"))
            minimum = int(request.form.get("minimum", "1"))
            maximum = int(request.form.get("maximum", "37"))
            if not 1 <= count <= 500:
                raise ValueError("Choose between 1 and 500 numbers.")
            samples = generate_numbers(count, minimum, maximum)
        except (TypeError, ValueError) as exc:
            error = str(exc) or "Please enter valid whole numbers."
            samples = None
    return render_template_string(
        PAGE, count=count, minimum=minimum, maximum=maximum, samples=samples, error=error
    )

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
