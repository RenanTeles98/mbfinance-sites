// Site analytics events for Google Tag Manager dataLayer.
(function () {
  var scrollDepths = [25, 50, 75, 90];
  var sentScrollDepths = {};

  function pushEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({
      event: eventName,
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title
    }, params || {}));
  }

  window.mbTrackEvent = pushEvent;

  function textOf(element) {
    return ((element && element.textContent) || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  function pathOf(url) {
    try {
      return new URL(url, window.location.href).pathname;
    } catch (e) {
      return '';
    }
  }

  function handleClick(event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var clickable = target.closest('a,button,[role="button"]');
    if (!clickable) return;

    var link = target.closest('a[href]');
    var clickText = textOf(clickable);
    var onclick = clickable.getAttribute('onclick') || '';
    var href = link ? link.href : '';
    var area = clickable.getAttribute('data-analytics-area') || '';
    var label = clickable.getAttribute('data-analytics-label') || clickText;

    if (/openLeadModal/i.test(onclick)) {
      pushEvent('cta_click', {
        click_text: clickText,
        cta_label: label,
        source_area: area || 'main_site',
        product: onclick.match(/openLeadModal\([^,]+,\s*'([^']+)'/)?.[1] || ''
      });
      pushEvent('lead_modal_open', {
        click_text: clickText,
        source_area: area || 'main_site'
      });
    }

    if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
      pushEvent('whatsapp_click', {
        click_text: clickText,
        link_url: href,
        source_area: area || 'main_site'
      });
    }

    if (pathOf(href).startsWith('/blog')) {
      pushEvent('blog_post_click', {
        post_path: pathOf(href),
        post_title: label,
        source_area: area || 'main_site'
      });
    }
  }

  function handleSubmit(event) {
    var form = event.target;
    if (!form || !form.matches) return;

    if (form.matches('#lead-form')) {
      var productEl = document.getElementById('lead-produto-select');
      var product = productEl ? productEl.value : '';

      pushEvent('generate_lead', {
        form_name: 'main_site_lead_form',
        source_area: 'lead_modal',
        product: product
      });
      pushEvent('whatsapp_click', {
        click_text: 'Enviar lead para WhatsApp',
        source_area: 'lead_modal',
        product: product
      });
    }

    if (form.matches('.newsletter-form')) {
      pushEvent('newsletter_submit', {
        form_name: 'main_site_newsletter',
        source_area: 'main_site'
      });
    }
  }

  function handleScroll() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    var percent = Math.round((window.scrollY / scrollable) * 100);
    scrollDepths.forEach(function (depth) {
      if (percent >= depth && !sentScrollDepths[depth]) {
        sentScrollDepths[depth] = true;
        pushEvent('scroll_depth', { scroll_depth: depth });
      }
    });
  }

  document.addEventListener('click', handleClick, true);
  document.addEventListener('submit', handleSubmit, true);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();
