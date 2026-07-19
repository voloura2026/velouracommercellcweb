const products = [
  {name:'The Everyday Tumbler', type:'home', meta:'Hand-finished stoneware', price:32, tag:'Bestseller', image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85'},
  {name:'Ritual Candle No. 01', type:'ritual', meta:'Cedar · Fig · Smoke', price:48, tag:'New', image:'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85'},
  {name:'The Soft Carryall', type:'carry', meta:'Organic cotton canvas', price:84, tag:'Made to last', image:'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85'},
  {name:'Sunday Incense Set', type:'ritual', meta:'Sandalwood · 30 sticks', price:28, tag:'', image:'https://images.unsplash.com/photo-1602607208132-7f9e2aa6eab0?auto=format&fit=crop&w=700&q=85'},
  {name:'The Daily Notebook', type:'carry', meta:'Recycled paper · A5', price:24, tag:'', image:'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=85'},
  {name:'Linen Hand Towel', type:'home', meta:'European flax linen', price:36, tag:'', image:'https://images.unsplash.com/photo-1583845112203-454c77fba7c3?auto=format&fit=crop&w=700&q=85'},
  {name:'The Quiet Tray', type:'home', meta:'Solid acacia wood', price:64, tag:'', image:'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=85'},
  {name:'Amber Glass Mist', type:'ritual', meta:'Neroli · Bergamot', price:26, tag:'', image:'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85'}
];
let cart=[];
const grid=document.querySelector('#productGrid');
function addShopActions(){grid.querySelectorAll('.product-card').forEach(card=>{if(card.querySelector('.product-actions'))return;const index=card.querySelector('.add-button').dataset.index;card.querySelector('.product-info').insertAdjacentHTML('beforeend',`<div class="product-actions"><button class="add-to-cart" data-index="${index}">Add to cart</button><button class="buy-now" data-index="${index}">Buy it now <span>↗</span></button></div>`)});grid.querySelectorAll('.add-to-cart').forEach(b=>b.onclick=()=>{cart.push(products[b.dataset.index]);updateCart();openCart()});grid.querySelectorAll('.buy-now').forEach(b=>b.onclick=()=>{cart.push(products[b.dataset.index]);updateCart();openCheckout()})}
new MutationObserver(addShopActions).observe(grid,{childList:true});
function renderProducts(filter='all'){grid.innerHTML=products.filter(p=>filter==='all'||p.type===filter).map((p,i)=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}<button class="add-button" data-index="${products.indexOf(p)}" aria-label="Add ${p.name} to bag">+</button></div><div class="product-info"><h3>${p.name}</h3><p>${p.meta}<strong>$${p.price}</strong></p></div></article>`).join('');
grid.querySelectorAll('.add-button').forEach(b=>b.addEventListener('click',()=>{cart.push(products[b.dataset.index]);updateCart();openCart()}));}
function updateCart(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#drawerCount').textContent=cart.length;document.querySelector('#cartTotal').textContent='$'+cart.reduce((a,p)=>a+p.price,0);document.querySelector('#cartItems').innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>$${p.price}</p><button data-remove="${i}">Remove</button></div></div>`).join(''):'<div class="empty-cart">Your bag is waiting for something lovely.</div>';document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{cart.splice(b.dataset.remove,1);updateCart()})}
function openCart(){document.querySelector('#cartDrawer').classList.add('open');document.querySelector('#backdrop').classList.add('open');document.querySelector('#cartDrawer').setAttribute('aria-hidden','false')}
function closeCart(){document.querySelector('#cartDrawer').classList.remove('open');document.querySelector('#backdrop').classList.remove('open');document.querySelector('#cartDrawer').setAttribute('aria-hidden','true')}
const checkoutModal=document.querySelector('#checkoutModal');
const billingField=document.querySelector('input[name="billingAddress"]')?.closest('label');
if(billingField){billingField.outerHTML='<label>Billing street address<input name="billingAddress" required autocomplete="billing street-address" /></label><div class="form-row"><label>Billing city<input name="billingCity" required autocomplete="billing address-level2" /></label><label>Billing state<input name="billingState" required autocomplete="billing address-level1" /></label><label>Billing ZIP code<input name="billingZip" required autocomplete="billing postal-code" /></label></div><label>Billing country<select name="billingCountry" required autocomplete="billing country"><option value="">Select country</option><option>United States</option><option>Canada</option><option>United Kingdom</option></select></label>'}
function renderCheckout(){document.querySelector('#checkoutItems').innerHTML=cart.length?cart.map(p=>`<div class="summary-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>$${p.price}</p></div></div>`).join(''):'<p class="empty-cart">Your bag is empty.</p>';document.querySelector('#checkoutTotal').textContent='$'+cart.reduce((a,p)=>a+p.price,0)}
function openCheckout(){if(!cart.length){alert('Add an item to your bag before checkout.');return}closeCart();renderCheckout();checkoutModal.classList.add('open');checkoutModal.setAttribute('aria-hidden','false')}
function closeCheckout(){checkoutModal.classList.remove('open');checkoutModal.setAttribute('aria-hidden','true')}
document.querySelector('.checkout-button').addEventListener('click',openCheckout);document.querySelector('#closeCheckout').addEventListener('click',closeCheckout);
checkoutModal.addEventListener('click',e=>{if(e.target===checkoutModal)closeCheckout()});
document.querySelector('#checkoutForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#checkoutMessage').textContent='Thank you — your order has been received.';e.target.reset();cart=[];updateCart();renderCheckout()});
document.querySelector('#checkoutForm').addEventListener('submit',()=>document.querySelector('#checkoutMessage').classList.add('is-visible'));
const contactPanel=document.querySelector('#contact');
function revealContact(e){if(e)e.preventDefault();contactPanel.classList.toggle('contact-visible')}
document.querySelector('#contactButton').addEventListener('click',revealContact);
document.querySelectorAll('a[href="#contact"]').forEach(link=>link.addEventListener('click',revealContact));
document.querySelector('#contactClose').addEventListener('click',()=>contactPanel.classList.remove('contact-visible'));
renderProducts();addShopActions();
document.querySelectorAll('.category-tabs button').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.category-tabs .active').classList.remove('active');b.classList.add('active');renderProducts(b.dataset.filter)}));
document.querySelector('#cartButton').onclick=openCart;document.querySelector('#closeCart').onclick=closeCart;document.querySelector('#backdrop').onclick=closeCart;
document.querySelector('#searchButton').onclick=()=>document.querySelector('#searchModal').classList.add('open');document.querySelector('#closeSearch').onclick=()=>document.querySelector('#searchModal').classList.remove('open');
document.querySelector('#newsletterForm').onsubmit=e=>{e.preventDefault();document.querySelector('#formMessage').textContent='You’re on the list — see you in your inbox.';e.target.reset()};
