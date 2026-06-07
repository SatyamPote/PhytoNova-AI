import { supabase } from './services/supabase.js';
import { trackEvent } from './services/firebase.js';

// ---------------------------------------------------------------------------
// Helpers — these exist as globals in index.html's inline <script>
// ---------------------------------------------------------------------------
const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
const showToast = (msg) => {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};
const clearFormErrors = () => {
  ['signin-error', 'signup-error'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['signin-email', 'signin-password', 'signup-name', 'signup-email', 'signup-password', 'signup-farm'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
};
const switchTab = (tab) => {
  const isSignin = tab === 'signin';
  document.getElementById('signin-form').style.display = isSignin ? 'block' : 'none';
  document.getElementById('tab-signin').classList.toggle('active', isSignin);
  document.getElementById('tab-signup').classList.toggle('active', !isSignin);
};

// ---------------------------------------------------------------------------
// Auto-login on page load
// ---------------------------------------------------------------------------
async function restoreSession() {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) return;

  const u = data.session.user;
  window.currentUser = {
    id: u.id,
    name: u.user_metadata?.full_name || u.email.split('@')[0],
    email: u.email,
    farm: u.user_metadata?.farm_type || '',
    createdAt: u.created_at,
  };
  window.loginSuccess();
  trackEvent('session_restore', { user_id: u.id });
}

// ---------------------------------------------------------------------------
// Override window.handleSignIn
// ---------------------------------------------------------------------------
window.handleSignIn = async function () {
  if (!supabase) {
    showToast('⚠️ Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    return;
  }

  clearFormErrors();
  const emailInput = document.getElementById('signin-email');
  const passwordInput = document.getElementById('signin-password');
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const errorEl = document.getElementById('signin-error');

  if (!email) {
    errorEl.textContent = 'Please enter your email address.';
    emailInput.classList.add('error');
    return;
  }
  if (!validateEmail(email)) {
    errorEl.textContent = 'Enter a valid email like farmer@example.com.';
    emailInput.classList.add('error');
    return;
  }
  if (!password) {
    errorEl.textContent = 'Please enter your password.';
    passwordInput.classList.add('error');
    return;
  }
  if (password.length < 4) {
    errorEl.textContent = 'Password must be at least 4 characters.';
    passwordInput.classList.add('error');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    errorEl.textContent = error?.message || 'Failed to sign in. Try again.';
    emailInput.classList.add('error');
    passwordInput.classList.add('error');
    return;
  }

  const u = data.user;
  window.currentUser = {
    id: u.id,
    name: u.user_metadata?.full_name || u.email.split('@')[0],
    email: u.email,
    farm: u.user_metadata?.farm_type || '',
    createdAt: u.created_at,
  };

  window.loginSuccess();
  trackEvent('login', { user_id: u.id, method: 'email' });
};

// ---------------------------------------------------------------------------
// Override window.handleSignUp
// ---------------------------------------------------------------------------
window.handleSignUp = async function () {
  if (!supabase) {
    showToast('⚠️ Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    return;
  }

  clearFormErrors();
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const farmInput = document.getElementById('signup-farm');
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const farmType = farmInput.value;
  const errorEl = document.getElementById('signup-error');

  if (!name) {
    errorEl.textContent = 'Please enter your full name.';
    nameInput.classList.add('error');
    return;
  }
  if (!email) {
    errorEl.textContent = 'Please enter your email address.';
    emailInput.classList.add('error');
    return;
  }
  if (!validateEmail(email)) {
    errorEl.textContent = 'Enter a valid email like farmer@example.com.';
    emailInput.classList.add('error');
    return;
  }
  if (!password) {
    errorEl.textContent = 'Please create a password.';
    passwordInput.classList.add('error');
    return;
  }
  if (password.length < 8) {
    errorEl.textContent = 'Password must be at least 8 characters long.';
    passwordInput.classList.add('error');
    return;
  }
  if (!farmType) {
    errorEl.textContent = 'Please select your farm type.';
    farmInput.classList.add('error');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, farm_type: farmType } },
  });

  if (error || !data.user) {
    errorEl.textContent = error?.message || 'Failed to create account. Try again.';
    if (error?.message?.toLowerCase().includes('already')) {
      emailInput.classList.add('error');
    }
    return;
  }

  // Insert profile row
  await supabase.from('profiles').upsert(
    { user_id: data.user.id, full_name: name },
    { onConflict: 'user_id' }
  );

  errorEl.style.color = 'var(--green-neon)';
  errorEl.textContent = '✓ Account created successfully! Redirecting to login...';

  nameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
  farmInput.value = '';

  setTimeout(() => {
    switchTab('signin');
    errorEl.style.color = '';
    errorEl.textContent = '';
  }, 2000);

  trackEvent('sign_up', { user_id: data.user.id, method: 'email' });
};

// ---------------------------------------------------------------------------
// Override window.saveDiseaseImage
// ---------------------------------------------------------------------------
window.saveDiseaseImage = async function (imageSrc, file, analysisResult) {
  if (!supabase) {
    showToast('⚠️ Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    return;
  }
  if (!window.currentUser?.id) {
    showToast('⚠️ Please sign in to save scans.');
    return;
  }

  try {
    const { error } = await supabase.from('detections').insert({
      user_id: window.currentUser.id,
      image_url: imageSrc,
      disease: analysisResult.name,
      confidence: analysisResult.confidence,
      treatment: Array.isArray(analysisResult.recommendations)
        ? analysisResult.recommendations.join('\n')
        : '',
    });

    if (error) throw error;

    showToast('✅ Image saved to database');
    trackEvent('disease_save', {
      disease: analysisResult.name,
      confidence: analysisResult.confidence,
    });

    if (typeof window.loadDiseaseHistory === 'function') {
      window.loadDiseaseHistory();
    }
  } catch (err) {
    console.error('saveDiseaseImage error:', err);
    showToast('⚠️ Failed to save image to database. See console for details.');
  }
};

// ---------------------------------------------------------------------------
// Override window.loadDiseaseHistory
// ---------------------------------------------------------------------------
window.loadDiseaseHistory = async function () {
  if (!supabase) return;

  const historyGrid = document.getElementById('historyGrid');
  if (!historyGrid) return;

  historyGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.55);padding:24px;">Loading saved scans...</div>`;

  const userId = window.currentUser?.id;
  if (!userId) {
    historyGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.55);padding:24px;">Please sign in to view your scan history.</div>`;
    return;
  }

  const { data: items, error } = await supabase
    .from('detections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    historyGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.55);padding:24px;">Unable to load saved scans.</div>`;
    return;
  }

  if (!items?.length) {
    historyGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.55);padding:24px;">No saved scans yet. Upload or capture a plant image to store it here.</div>`;
    return;
  }

  historyGrid.innerHTML = items.map((item) => {
    const resultName = item.disease || 'Plant scan';
    const tagType = item.type || 'healthy';
    const createdAt = new Date(item.created_at).toLocaleString();
    return `
      <div style="background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;overflow:hidden;">
        <img src="${item.image_url}" alt="Saved scan" style="width:100%;height:140px;object-fit:cover;display:block;" />
        <div style="padding:12px;">
          <div style="font-size:13px;font-weight:700;margin-bottom:8px;min-height:38px;">${resultName}</div>
          <div class="disease-tag ${tagType}" style="margin-bottom:10px;font-size:11px;">${resultName}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.45);">${createdAt}</div>
        </div>
      </div>
    `;
  }).join('');
};

// ---------------------------------------------------------------------------
// Override window.handleLogout
// ---------------------------------------------------------------------------
window.handleLogout = (function () {
  const original = window.handleLogout;
  return async function () {
    if (typeof supabase !== 'undefined' && supabase) {
      await supabase.auth.signOut();
    }
    if (typeof original === 'function') {
      original();
    }
  };
})();

// ---------------------------------------------------------------------------
// Checkout Integration — Order Saving + Email
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helper: calculateCartTotal
// ---------------------------------------------------------------------------
const calculateCartTotal = () => window.cartItems?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;

// ---------------------------------------------------------------------------
// Helper: sendOrderEmail
// ---------------------------------------------------------------------------
const sendOrderEmail = async ({ to, cartItems, total, orderId, customerName, address }) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[PhytoNova] VITE_RESEND_API_KEY not set — skipping order email.');
    return;
  }

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a2018;color:#1a1a1a;">
      <div style="background:#0a2018;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#22c55e;margin:0;font-size:28px;">🌿 PhytoNova Order Confirmed</h1>
        <p style="color:#86efac;margin:8px 0 0;font-size:14px;">Thank you for your order, ${customerName || 'farmer'}!</p>
      </div>
      <div style="padding:32px;background:#fff;">
        <p style="font-size:16px;margin:0 0 8px;"><strong>Order ID:</strong> <span style="color:#22c55e;font-weight:700;">${orderId}</span></p>
        <p style="font-size:14px;color:#555;margin:0 0 24px;">Placed just now</p>
        <hr style="border:none;border-top:1px solid #eee;margin:0 0 24px;" />
        <h2 style="font-size:16px;margin:0 0 16px;color:#333;">Items Ordered</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:10px 8px;text-align:left;color:#555;">Product</th>
              <th style="padding:10px 8px;text-align:center;color:#555;">Qty</th>
              <th style="padding:10px 8px;text-align:right;color:#555;">Price</th>
              <th style="padding:10px 8px;text-align:right;color:#555;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${(cartItems || []).map(item => `
              <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px 8px;color:#333;">${item.name || item.product_name || 'Product'}</td>
                <td style="padding:10px 8px;text-align:center;color:#333;">× ${item.qty || 1}</td>
                <td style="padding:10px 8px;text-align:right;color:#333;">₹${(item.price || 0).toLocaleString('en-IN')}</td>
                <td style="padding:10px 8px;text-align:right;color:#333;font-weight:700;">₹${((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;text-align:right;">
          <span style="font-size:14px;color:#555;">Total Paid: </span>
          <span style="font-size:22px;font-weight:700;color:#16a34a;">₹${(total || 0).toLocaleString('en-IN')}</span>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <h2 style="font-size:16px;margin:0 0 12px;color:#333;">Delivery Address</h2>
        <p style="font-size:14px;color:#555;margin:0;line-height:1.6;">${address || 'Not provided'}</p>
      </div>
      <div style="background:#f5f5f5;padding:16px 32px;border-radius:0 0 12px 12px;text-align:center;">
        <p style="margin:0;font-size:12px;color:#999;">© PhytoNova AI — Your smart farming companion</p>
      </div>
    </div>`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PhytoNova <orders@phytonova.ai>',
        to,
        subject: `Your PhytoNova Order Confirmation — ${orderId}`,
        html: htmlBody,
      }),
    });
  } catch (err) {
    console.error('[PhytoNova] Failed to send order email:', err);
  }
};

// ---------------------------------------------------------------------------
// Override window.goPayStep
// ---------------------------------------------------------------------------
window.goPayStep = (function () {
  const originalGoPayStep = window.goPayStep;
  return async function (step) {
    if (step === 2) {
      const name = document.getElementById('addr-name')?.value.trim();
      const phone = document.getElementById('addr-phone')?.value.trim();
      const address = document.getElementById('addr-address')?.value.trim();

      if (!name || !phone || !address) {
        window.showToast('⚠️ Please complete delivery name, phone and address.');
        return;
      }
      if (typeof window.validatePhone === 'function' && !window.validatePhone(phone)) {
        window.showToast('⚠️ Please enter a valid phone number.');
        return;
      }
    }

    if (step === 3) {
      const paymentMethod = document.querySelector('input[name="payment"]:checked');
      const selected = paymentMethod ? paymentMethod.value : 'upi';
      if (selected === 'upi') {
        const upi = document.getElementById('upiId')?.value.trim();
        if (typeof window.validateUPI === 'function' && !window.validateUPI(upi)) {
          window.showToast('⚠️ Please enter a valid UPI ID.');
          return;
        }
      }

      const name = document.getElementById('addr-name')?.value.trim();
      const phone = document.getElementById('addr-phone')?.value.trim();
      const address = document.getElementById('addr-address')?.value.trim();
      const total = calculateCartTotal();
      const orderId = 'PNI-' + Math.floor(Math.random() * 900000 + 100000);

      const orderIdEl = document.getElementById('orderId');
      if (orderIdEl) orderIdEl.textContent = orderId;

      if (window.supabase && window.currentUser?.id) {
        try {
          await window.supabase.from('orders').insert({
            user_id: window.currentUser.id,
            customer_name: name,
            customer_email: window.currentUser.email,
            customer_phone: phone,
            customer_address: address,
            cart_items: window.cartItems,
            total_price: total,
            status: 'confirmed',
          });
        } catch (err) {
          console.error('[PhytoNova] Failed to save order to Supabase:', err);
        }
      }

      if (window.currentUser?.email) {
        await sendOrderEmail({
          to: window.currentUser.email,
          cartItems: window.cartItems,
          total,
          orderId,
          customerName: name,
          address,
        });
      }

      if (typeof window.addNotification === 'function') {
        window.addNotification('Order Confirmed', 'Your order has been placed successfully and is being processed.', 'Just now');
      }
      window.showToast('🎉 Order placed successfully!');
      trackEvent('purchase', { value: total, currency: 'INR', items: window.cartItems?.length || 0 });

      return originalGoPayStep(step);
    }

    return originalGoPayStep(step);
  };
})();

// ---------------------------------------------------------------------------
// Override window.renderCart — ensure #cartTotal is always accurate
// ---------------------------------------------------------------------------
window.renderCart = (function () {
  const originalRenderCart = window.renderCart;
  return function (...args) {
    if (typeof originalRenderCart === 'function') {
      originalRenderCart.apply(this, args);
    }
    const total = calculateCartTotal();
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  };
})();

// ---------------------------------------------------------------------------
// Attach everything after DOM is ready
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  restoreSession();
});