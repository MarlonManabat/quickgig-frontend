// Server component – renders the legacy login HTML fragment but posts to our same-origin API
import { readLegacy } from '@/lib/readLegacy';

export const metadata = { title: 'Login — QuickGig.ph' };

export default async function Login() {
  const body = await readLegacy('login.fragment.html'); // BODY fragment only

  // Inject a tiny script that hijacks the legacy form submit and posts to /api/session/login
  // Expected inputs: name="email", name="password"
  const bridge = `
  <script>
  (function(){
    var form = document.querySelector('form');
    if(!form){ return; }
    form.addEventListener('submit', async function(e){
      try{
        e.preventDefault();
        var fd = new FormData(form);
        var payload = { email: fd.get('email') || fd.get('username'), password: fd.get('password') };
        var res = await fetch('/api/session/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          location.assign('/dashboard');
        } else {
          var msg = (await res.json().catch(()=>({message:'Login failed'}))).message || 'Invalid email or password';
          alert(msg);
        }
      }catch(err){ console.error('[legacy-login-bridge]', err); alert('Network error. Please try again.'); }
    }, { once: true });
  })();
  </script>`;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: body + bridge }}
    />
  );
}
