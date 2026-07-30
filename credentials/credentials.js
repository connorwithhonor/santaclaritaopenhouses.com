(function () {
  var list = document.querySelector('[data-cr-checklist]');
  if (list) {
    var boxes = Array.prototype.slice.call(list.querySelectorAll('input[type="checkbox"]'));
    var scoreEl = document.querySelector('[data-cr-score]');
    var verdictEl = document.querySelector('[data-cr-verdict]');
    var bands = [
      [0, 0, "Start ticking boxes."],
      [1, 2, "Walk away. That is a business card, not an agent."],
      [3, 4, "Weak. Nothing here proves they can sell your house."],
      [5, 6, "Average. Most agents land right here. Push harder before you sign."],
      [7, 8, "Solid. Now get the marketing plan and the numbers in writing."],
      [9, 10, "Strong. That is what a real listing interview looks like."]
    ];
    function verdictFor(count) {
      for (var i = 0; i < bands.length; i++) {
        if (count >= bands[i][0] && count <= bands[i][1]) return bands[i][2];
      }
      return "";
    }
    function update() {
      var count = boxes.filter(function (b) { return b.checked; }).length;
      if (scoreEl) scoreEl.textContent = count + " / 10";
      if (verdictEl) verdictEl.textContent = verdictFor(count);
    }
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  var forms = document.querySelectorAll('[data-cr-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('[data-cr-status]');
      var fd = new FormData(form);
      if (fd.get('website')) return;
      var payload = {
        name: fd.get('name') || '',
        phone: fd.get('phone') || '',
        email: fd.get('email') || '',
        message: fd.get('message') || '',
        src: fd.get('src') || 'credentials'
      };
      if (status) status.textContent = 'Sending...';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (status) status.textContent = res.ok ? 'Got it. Connor will reach out.' : 'Something went wrong. Call ' + '661-888-4983' + ' instead.';
        if (res.ok) form.reset();
      }).catch(function () {
        if (status) status.textContent = 'Something went wrong. Call 661-888-4983 instead.';
      });
    });
  });
})();
