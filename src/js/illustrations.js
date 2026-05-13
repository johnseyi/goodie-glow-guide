/* Goodie Glow Guide — SVG Illustration System
   Sets window.GoodieIllustrations before app.js runs.
   All step icons: 64×64 viewBox. Week themes: 120×80 viewBox.
   Colours match the design-system tokens in styles.css.
*/
(function () {
  'use strict';

  /* ── Step icons ─────────────────────────────── */

  var cleanse = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#DEEFFE"/>'
    // three teardrops
    + '<path d="M18 22C18 22 13 28 13 32C13 35.3 15.2 37 18 37C20.8 37 23 35.3 23 32C23 28 18 22 18 22Z" fill="#64B5F6"/>'
    + '<path d="M32 14C32 14 25 23 25 30C25 35.5 28 39 32 39C36 39 39 35.5 39 30C39 23 32 14 32 14Z" fill="#1E88E5"/>'
    + '<path d="M46 22C46 22 41 28 41 32C41 35.3 43.2 37 46 37C48.8 37 51 35.3 51 32C51 28 46 22 46 22Z" fill="#64B5F6"/>'
    // shine on centre drop
    + '<circle cx="29" cy="22" r="2" fill="white" opacity="0.4"/>'
    + '</svg>';

  var tone = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#E8F5E9"/>'
    // pump head
    + '<rect x="23" y="10" width="18" height="5" rx="2.5" fill="#527056"/>'
    // pump neck
    + '<rect x="29" y="14" width="6" height="10" rx="3" fill="#527056"/>'
    // bottle body
    + '<rect x="21" y="22" width="22" height="28" rx="5" fill="#6B8E6F"/>'
    // highlight stripe
    + '<rect x="24" y="26" width="5" height="18" rx="2.5" fill="white" opacity="0.2"/>'
    // label area
    + '<rect x="24" y="34" width="16" height="10" rx="2" fill="white" opacity="0.22"/>'
    + '</svg>';

  var vitaminCSerum = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#FFF8E1"/>'
    // dropper bulb
    + '<ellipse cx="32" cy="14" rx="6" ry="7" fill="#B8962A"/>'
    // dropper stem
    + '<rect x="29" y="19" width="6" height="10" rx="3" fill="#B8962A"/>'
    // bottle body
    + '<rect x="25" y="27" width="14" height="20" rx="4" fill="#D4AF37"/>'
    // golden drop below
    + '<path d="M32 48C32 48 30 52 30 53.5C30 55 31 56 32 56C33 56 34 55 34 53.5C34 52 32 48 32 48Z" fill="#D4AF37"/>'
    // highlight
    + '<rect x="27" y="31" width="3.5" height="12" rx="1.75" fill="white" opacity="0.25"/>'
    + '</svg>';

  var niacinamideSerum = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#E8F5E9"/>'
    + '<ellipse cx="32" cy="14" rx="6" ry="7" fill="#3D5940"/>'
    + '<rect x="29" y="19" width="6" height="10" rx="3" fill="#3D5940"/>'
    + '<rect x="25" y="27" width="14" height="20" rx="4" fill="#527056"/>'
    + '<path d="M32 48C32 48 30 52 30 53.5C30 55 31 56 32 56C33 56 34 55 34 53.5C34 52 32 48 32 48Z" fill="#6B8E6F"/>'
    + '<rect x="27" y="31" width="3.5" height="12" rx="1.75" fill="white" opacity="0.25"/>'
    + '</svg>';

  var moisturize = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#FFF3E0"/>'
    // open jar lid (tilted, top-right)
    + '<rect x="38" y="12" width="16" height="7" rx="3.5" fill="#A8896A" transform="rotate(-12 38 12)"/>'
    // jar rim
    + '<rect x="13" y="26" width="38" height="7" rx="3.5" fill="#A8896A"/>'
    // jar body
    + '<rect x="15" y="31" width="34" height="22" rx="5" fill="#8B6F47"/>'
    // cream wave inside jar
    + '<path d="M20 40C23 36 27 44 32 40C37 36 41 42 45 40" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.45"/>'
    + '</svg>';

  var sunscreen = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#FFFDE7"/>'
    // 8 rays (pre-computed; sun radius 12, gap 2, ray len 6)
    + '<line x1="46" y1="32" x2="52" y2="32" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="42" y1="42" x2="46" y2="46" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="32" y1="46" x2="32" y2="52" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="22" y1="42" x2="18" y2="46" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="18" y1="32" x2="12" y2="32" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="22" y1="22" x2="18" y2="18" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="32" y1="18" x2="32" y2="12" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    + '<line x1="42" y1="22" x2="46" y2="18" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>'
    // sun disc
    + '<circle cx="32" cy="32" r="12" fill="#FFD700"/>'
    + '<circle cx="32" cy="32" r="6" fill="#FFEE00" opacity="0.5"/>'
    + '</svg>';

  var eyeCream = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#EDE7F6"/>'
    // eye white
    + '<path d="M10 32C10 32 19 20 32 20C45 20 54 32 54 32C54 32 45 44 32 44C19 44 10 32 10 32Z" fill="white" stroke="#9575CD" stroke-width="1.5"/>'
    // iris
    + '<circle cx="32" cy="32" r="9" fill="#7E57C2"/>'
    // pupil
    + '<circle cx="32" cy="32" r="5" fill="#311B92"/>'
    // eye shine
    + '<circle cx="36" cy="27" r="2.5" fill="white" opacity="0.75"/>'
    // small cream dots (bottom-left, decorative)
    + '<circle cx="16" cy="43" r="2" fill="#CE93D8" opacity="0.55"/>'
    + '<circle cx="11" cy="38" r="1.5" fill="#CE93D8" opacity="0.35"/>'
    + '</svg>';

  var lipBalm = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#FFF0E8"/>'
    // tube body
    + '<rect x="24" y="32" width="16" height="22" rx="4" fill="#C47A2B"/>'
    // balm stick (raised above tube)
    + '<rect x="26" y="17" width="12" height="17" rx="3" fill="#D4AF37"/>'
    // balm top (slightly rounded dome)
    + '<ellipse cx="32" cy="17" rx="6" ry="3.5" fill="#E8C66A"/>'
    // tube highlight
    + '<rect x="27" y="36" width="3.5" height="14" rx="1.75" fill="white" opacity="0.2"/>'
    + '</svg>';

  var defaultIcon = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#FAF2E8"/>'
    // cap
    + '<rect x="25" y="10" width="14" height="5" rx="2.5" fill="#6E5636"/>'
    // neck
    + '<rect x="28" y="14" width="8" height="9" rx="3" fill="#6E5636"/>'
    // body
    + '<rect x="22" y="21" width="20" height="28" rx="5" fill="#8B6F47"/>'
    // highlight
    + '<rect x="25" y="25" width="4" height="16" rx="2" fill="white" opacity="0.2"/>'
    // 4-point star label accent
    + '<path d="M32 30L33 33H36L33.5 35L34.5 38L32 36.5L29.5 38L30.5 35L28 33H31Z" fill="white" opacity="0.35"/>'
    + '</svg>';

  /* ── Remedy illustration ─────────────────────── */

  var remedy = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#FFF8E1"/>'
    // mortar bowl
    + '<path d="M12 28C12 28 14 50 32 50C50 50 52 28 52 28Z" fill="#FF9800" opacity="0.85"/>'
    // rim
    + '<rect x="10" y="23" width="44" height="7" rx="3.5" fill="#F57C00"/>'
    // powder puff dots above
    + '<circle cx="22" cy="16" r="3.5" fill="#FF9800" opacity="0.45"/>'
    + '<circle cx="32" cy="11" r="4.5" fill="#FFA726" opacity="0.55"/>'
    + '<circle cx="42" cy="16" r="3.5" fill="#FF9800" opacity="0.45"/>'
    + '</svg>';

  /* ── Week theme illustrations ────────────────── */

  var week1 = '<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    // three rising bars — foundation / building blocks
    + '<rect x="12" y="52" width="26" height="20" rx="4" fill="#8B6F47" opacity="0.65"/>'
    + '<rect x="47" y="36" width="26" height="36" rx="4" fill="#8B6F47" opacity="0.82"/>'
    + '<rect x="82" y="20" width="26" height="52" rx="4" fill="#8B6F47"/>'
    // sparkle above the tallest bar
    + '<circle cx="95" cy="13" r="3.5" fill="#D4AF37"/>'
    + '<circle cx="88" cy="7" r="2" fill="#D4AF37" opacity="0.55"/>'
    + '</svg>';

  var week2 = '<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    // three water drops — hydration
    + '<path d="M22 14C22 14 12 27 12 36C12 46.5 16.6 52 22 52C27.4 52 32 46.5 32 36C32 27 22 14 22 14Z" fill="#42A5F5" opacity="0.65"/>'
    + '<path d="M60 6C60 6 49 21 49 32C49 43 54 50 60 50C66 50 71 43 71 32C71 21 60 6 60 6Z" fill="#1E88E5"/>'
    + '<path d="M98 14C98 14 88 27 88 36C88 46.5 92.6 52 98 52C103.4 52 108 46.5 108 36C108 27 98 14 98 14Z" fill="#42A5F5" opacity="0.75"/>'
    // shine dots
    + '<circle cx="55" cy="18" r="2.5" fill="white" opacity="0.45"/>'
    + '<circle cx="93" cy="22" r="2" fill="white" opacity="0.35"/>'
    + '</svg>';

  var week3 = '<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    // large centre star
    + '<path d="M60 8L64 28H84L68 40L74 60L60 49L46 60L52 40L36 28H56Z" fill="#D4AF37"/>'
    // small star top-right
    + '<path d="M98 15L100 22H107L101.5 26L103.5 33L98 29.5L92.5 33L94.5 26L89 22H96Z" fill="#FFA500" opacity="0.8"/>'
    // small star top-left
    + '<path d="M22 18L24 25H31L25.5 29L27.5 36L22 32.5L16.5 36L18.5 29L13 25H20Z" fill="#FFD700" opacity="0.75"/>'
    // glow dots
    + '<circle cx="90" cy="58" r="4.5" fill="#D4AF37" opacity="0.4"/>'
    + '<circle cx="30" cy="60" r="3" fill="#D4AF37" opacity="0.3"/>'
    + '</svg>';

  var week4 = '<svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    // crown body
    + '<path d="M18 62L28 28L45 50L60 16L75 50L92 28L102 62Z" fill="#D4AF37"/>'
    // crown band
    + '<rect x="16" y="60" width="88" height="14" rx="4" fill="#B8962A"/>'
    // gem dots on crown points
    + '<circle cx="28" cy="28" r="5.5" fill="#C62828"/>'
    + '<circle cx="60" cy="16" r="5.5" fill="#1565C0"/>'
    + '<circle cx="92" cy="28" r="5.5" fill="#2E7D32"/>'
    // inner crown highlight
    + '<path d="M38 52L60 24L82 52" stroke="white" stroke-width="1.5" fill="none" opacity="0.28"/>'
    + '</svg>';

  /* ── UI / state illustrations ────────────────── */

  var loading = '<svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" class="loading-sparkle" aria-hidden="true">'
    + '<path d="M50 6L52.5 18H65L55 25L58.5 37L50 30L41.5 37L45 25L35 18H47.5Z" fill="#D4AF37" class="spark spark--1"/>'
    + '<path d="M82 22L84 29H91L85.5 33L87.5 40L82 36.5L76.5 40L78.5 33L73 29H80Z" fill="#D4AF37" class="spark spark--2"/>'
    + '<path d="M18 22L20 29H27L21.5 33L23.5 40L18 36.5L12.5 40L14.5 33L9 29H16Z" fill="#D4AF37" class="spark spark--3"/>'
    + '</svg>';

  var emptyState = '<svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    // flower petals (8 ellipses around centre)
    + '<ellipse cx="60" cy="34" rx="5" ry="12" fill="#8B6F47" opacity="0.45"/>'
    + '<ellipse cx="60" cy="66" rx="5" ry="12" fill="#8B6F47" opacity="0.45"/>'
    + '<ellipse cx="44" cy="50" rx="12" ry="5" fill="#8B6F47" opacity="0.45"/>'
    + '<ellipse cx="76" cy="50" rx="12" ry="5" fill="#8B6F47" opacity="0.45"/>'
    + '<ellipse cx="48.8" cy="38.8" rx="5" ry="12" fill="#8B6F47" opacity="0.3" transform="rotate(-45 48.8 38.8)"/>'
    + '<ellipse cx="71.2" cy="38.8" rx="5" ry="12" fill="#8B6F47" opacity="0.3" transform="rotate(45 71.2 38.8)"/>'
    + '<ellipse cx="48.8" cy="61.2" rx="5" ry="12" fill="#8B6F47" opacity="0.3" transform="rotate(45 48.8 61.2)"/>'
    + '<ellipse cx="71.2" cy="61.2" rx="5" ry="12" fill="#8B6F47" opacity="0.3" transform="rotate(-45 71.2 61.2)"/>'
    // centre
    + '<circle cx="60" cy="50" r="14" fill="#FAF2E8"/>'
    + '<circle cx="60" cy="50" r="9" fill="#D4AF37" opacity="0.55"/>'
    + '</svg>';

  var checkmark = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<circle cx="32" cy="32" r="28" fill="#4A7C59"/>'
    + '<path d="M20 32L28 40L44 24" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg>';

  var camera = '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect width="64" height="64" rx="14" fill="#E8F5E9"/>'
    + '<rect x="10" y="22" width="44" height="30" rx="6" fill="#6B8E6F"/>'
    // viewfinder bump
    + '<rect x="22" y="16" width="20" height="8" rx="4" fill="#527056"/>'
    // lens outer
    + '<circle cx="32" cy="37" r="11" fill="#3D5940"/>'
    // lens inner
    + '<circle cx="32" cy="37" r="7" fill="#1B2F1E"/>'
    // shine
    + '<circle cx="35.5" cy="33" r="2.5" fill="white" opacity="0.4"/>'
    // flash
    + '<circle cx="44" cy="27" r="3" fill="#D4AF37"/>'
    + '</svg>';

  /* ── Export ──────────────────────────────────── */

  window.GoodieIllustrations = {
    // Flat step-slug keys (match content.js step names exactly)
    'cleanse':           cleanse,
    'tone':              tone,
    'serum':             vitaminCSerum,  // generic serum → golden dropper
    'vitamin-c-serum':   vitaminCSerum,
    'niacinamide-serum': niacinamideSerum,
    'moisturize':        moisturize,
    'moisturiser':       moisturize,   // British spelling fallback
    'sunscreen':         sunscreen,
    'spf':               sunscreen,
    'eye-cream':         eyeCream,
    'lip-balm':          lipBalm,
    'remedy':            remedy,
    'default':           defaultIcon,

    // Week theme illustrations (keyed by week number)
    week: { 1: week1, 2: week2, 3: week3, 4: week4 },

    // UI / state helpers
    loading:    loading,
    emptyState: emptyState,
    checkmark:  checkmark,
    camera:     camera
  };
}());
