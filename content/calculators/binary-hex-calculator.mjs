export default {
  slug: 'binary-hex-calculator',
  hub: 'math',
  name: 'Binary to Hex Converter',
  title: 'Binary to Hex Converter: 11010110 = D6 (Decimal 214)',
  h1: 'Binary, Hex, Decimal and Octal Converter With Step-by-Step Grouping',
  meta: 'Binary 11010110 is D6 in hex: split it into 1101 and 0110, which are D and 6. Convert binary, hex, decimal and octal either way, with 4-bit grouping steps.',
  keyword: 'how to calculate binary to hexadecimal',
  also: ['binary to hex converter', 'hex to binary converter', 'binary to decimal converter', 'decimal to hex converter', 'octal converter'],
  updated: '2026-11-13',
  inputs: [
    { id: 'from', label: 'Convert from', type: 'select', value: 'bin', options: [['bin', 'Binary (base 2)'], ['hex', 'Hexadecimal (base 16)'], ['dec', 'Decimal (base 10)'], ['oct', 'Octal (base 8)']] },
    { id: 'val', label: 'Number', type: 'text', value: '11010110', placeholder: 'e.g. 11010110, D6, 214 or 326' }
  ],
  compute(v, H) {
    var s = String(v.val || '').trim().replace(/[\s_,]/g, ''), neg = false;
    if (s.charAt(0) === '-' || s.charAt(0) === '−') { neg = true; s = s.slice(1); }
    var from = v.from;
    s = s.replace(/^0[bxo]/i, function (p) { return (p[1].toLowerCase() === 'b' && from === 'bin') || (p[1].toLowerCase() === 'x' && from === 'hex') || (p[1].toLowerCase() === 'o' && from === 'oct') ? '' : p; });
    if (from === 'hex') s = s.replace(/^#/, '');
    var pat = { bin: /^[01]+$/, oct: /^[0-7]+$/, dec: /^[0-9]+$/, hex: /^[0-9a-f]+$/i }[from];
    var name = { bin: 'binary', oct: 'octal', dec: 'decimal', hex: 'hexadecimal' }[from];
    if (!s) return { error: 'Enter a ' + name + ' number.' };
    if (!pat.test(s)) return { error: 'That is not a valid ' + name + ' number. ' + (from === 'bin' ? 'Use only 0 and 1.' : from === 'oct' ? 'Use digits 0–7.' : from === 'hex' ? 'Use 0–9 and A–F.' : 'Use digits 0–9.') };
    if (s.length > 256) return { error: 'Please enter 256 digits or fewer.' };
    var n = from === 'dec' ? BigInt(s) : BigInt((from === 'bin' ? '0b' : from === 'oct' ? '0o' : '0x') + s);
    var sg = neg && n !== 0n ? '−' : '';
    var bin = n.toString(2), hex = n.toString(16).toUpperCase(), oct = n.toString(8), dec = n.toString(10).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var pad = bin.length % 4 ? new Array(5 - bin.length % 4).join('0') + bin : bin;
    var nibbles = pad.match(/.{4}/g);
    var grouped = nibbles.join(' ');
    var rows = [
      ['Hexadecimal', sg + hex, from !== 'hex'],
      ['Binary (grouped in 4s)', sg + grouped, from === 'hex'],
      ['Decimal', sg + dec],
      ['Octal', sg + oct],
      ['Bits needed', String(bin.length) + (bin.length > 1 ? ' (' + Math.ceil(bin.length / 8) + ' byte' + (Math.ceil(bin.length / 8) > 1 ? 's' : '') + ')' : '')]
    ];
    if (neg && n !== 0n) {
      [8, 16, 32].forEach(function (w) {
        var lim = 1n << BigInt(w - 1);
        if (n <= lim) { var tc = ((1n << BigInt(w)) - n).toString(2); rows.push([w + '-bit two\'s complement', tc.match(/.{4}/g).join(' ') + ' = 0x' + ((1n << BigInt(w)) - n).toString(16).toUpperCase()]); }
      });
    } else if (bin.length <= 9 && from === 'bin') rows.push(['Excel formula', '=BIN2HEX("' + bin + '")']);
    else if (from === 'dec' && n <= 511n) rows.push(['Excel formula', '=DEC2HEX(' + n.toString() + ') or =DEC2BIN(' + n.toString() + ')']);
    var out = {
      value: sg + (from === 'hex' ? grouped : hex),
      label: from === 'hex' ? 'Binary' : 'Hexadecimal',
      expr: (from === 'hex' ? '0x' : from === 'bin' ? '0b' : from === 'oct' ? '0o' : '') + (neg ? '−' : '') + s.toUpperCase() + ' (' + name + ')',
      rows: rows
    };
    if (nibbles.length <= 16) out.table = { head: ['4-bit group', 'Value', 'Hex digit'], rows: nibbles.map(function (q) { var d = parseInt(q, 2); return [q, String(d), d.toString(16).toUpperCase()]; }), caption: 'Binary split into groups of 4 from the right' };
    return out;
  },
  quick: ({ r }) => `To convert binary to hexadecimal, split the bits into groups of four from the right and replace each group with one hex digit. 11010110 becomes 1101 | 0110; 1101 is 13, which is D, and 0110 is 6, so the answer is <strong>${r.value}</strong>. In decimal that is 13 × 16 + 6 = 214, and in octal it is 326.`,
  stepsTitle: 'How to calculate binary to hexadecimal',
  steps: [
    'Start at the right-hand end of the binary number and mark off groups of four bits.',
    'If the leftmost group is short, pad it with zeros on the left: 1011101 becomes 0101 1101. Padding on the right instead changes the value and is the classic mistake.',
    'Convert each group to its value from 0 to 15 using place values 8, 4, 2, 1, and write 10–15 as A–F.',
    'Read the hex digits left to right: 0101 1101 is 5D. To go from hex back to binary, expand each digit into four bits.'
  ],
  formulaTitle: 'How do place values work in binary and hex?',
  formula: {
    expr: 'Binary: … 128 64 32 16 8 4 2 1 (powers of 2)<br>Hex: … 4096 256 16 1 (powers of 16)<br>1 hex digit = 4 bits &nbsp;·&nbsp; 1 octal digit = 3 bits',
    vars: [['bit', 'a binary digit, 0 or 1'], ['nibble', 'a group of 4 bits, one hex digit'], ['byte', '8 bits, two hex digits (00 to FF)']],
    note: 'Because 16 = 2⁴, every hex digit maps to exactly four bits, so binary and hex convert by grouping with no arithmetic. Decimal does not line up with binary this way, which is why converting to or from decimal needs division or place values.'
  },
  example: `<p>Convert 11010110 to hexadecimal and decimal.</p>
<p>Groups: <strong>1101</strong> = 8 + 4 + 1 = 13 = D, and <strong>0110</strong> = 4 + 2 = 6. Hex: <strong>D6</strong>.</p>
<p>Decimal from the bits: 128 + 64 + 16 + 4 + 2 = <strong>214</strong>. From the hex: 13 × 16 + 6 = 214. ✓</p>`,
  table: {
    title: 'What are 0 to 15 in binary, hex and octal?',
    intro: 'The 16 four-bit patterns. Memorize this table and binary-to-hex conversion becomes a lookup. Generated by the converter above.',
    head: ['Decimal', 'Binary', 'Hex', 'Octal'],
    rows: ({ run }) => Array.from({ length: 16 }, (_, d) => { const o = run({ from: 'dec', val: String(d) }); return [String(d), o.rows[1][1], o.rows[0][1], o.rows[3][1]]; })
  },
  sections: [
    {
      h2: 'How do you convert hex to binary?',
      html: `<p>Replace each hex digit with its four-bit pattern from the table, keeping leading zeros inside the number. 3F becomes 0011 1111; A7 becomes 1010 0111; 2B4 becomes 0010 1011 0100. You can drop zeros at the very start of the result (0010 1011 0100 = 1010110100) without changing the value.</p>
<p>Web colors are a handy check. In #D6A020, the red channel D6 is 1101 0110 in binary and 214 in decimal, out of a maximum of FF = 255.</p>`
    },
    {
      h2: 'How do you convert decimal to binary or hex?',
      html: `<p>Divide repeatedly and keep the remainders. For hex, divide by 16: 214 ÷ 16 = 13 remainder 6, and 13 ÷ 16 = 0 remainder 13 (D). Read the remainders from last to first: <strong>D6</strong>. For binary, divide by 2 the same way, or subtract the largest powers of 2 that fit: 214 = 128 + 64 + 16 + 4 + 2, so the 128, 64, 16, 4 and 2 bits are 1: 11010110.</p>
<p>Going the other way, multiply each digit by its place value and add: 326 in octal is 3 × 64 + 2 × 8 + 6 = 214.</p>`
    },
    {
      h2: 'How do you convert binary to hex in Excel, Python or JavaScript?',
      html: `<ul>
<li><strong>Excel and Google Sheets:</strong> <code>=BIN2HEX("11010110")</code> returns D6; <code>=HEX2BIN("D6")</code>, <code>=DEC2HEX(214)</code> and <code>=HEX2DEC("D6")</code> work the same way. Excel's BIN2HEX accepts at most 10 bits, treating the 10th as a sign bit (two's complement), and DEC2BIN only accepts −512 to 511. For longer values, convert in chunks or use this page.</li>
<li><strong>Python:</strong> <code>hex(int("11010110", 2))</code> gives '0xd6'; <code>bin(0xD6)</code> gives '0b11010110'.</li>
<li><strong>JavaScript:</strong> <code>parseInt("11010110", 2).toString(16)</code> gives 'd6'; use BigInt for numbers longer than 53 bits.</li>
</ul>
<p>Code marks the base with a prefix: 0b for binary, 0x for hex and 0o for octal. You can paste values with these prefixes into the converter.</p>`
    },
    {
      h2: 'How are negative numbers stored in binary?',
      html: `<p>Computers use two's complement: to store −n in w bits, write 2ʷ − n. In 8 bits, −42 is 256 − 42 = 214, which is 11010110, the same bit pattern as the default example. Whether 11010110 means 214 or −42 depends on whether the program treats the byte as unsigned or signed.</p>
<p>A quick manual method: write +42 in binary (00101010), flip every bit (11010101), and add 1 (11010110). Enter a negative decimal number above to see its 8-, 16- and 32-bit two's complement forms.</p>`
    }
  ],
  faq: [
    { q: 'Why does hexadecimal use letters?', a: 'Base 16 needs sixteen single-character digits, and 0–9 only supply ten. A, B, C, D, E and F stand for 10 through 15.' },
    { q: 'How many bits are in one hex digit?', a: 'Four. One byte (8 bits) is exactly two hex digits, from 00 to FF.' },
    { q: 'What is FF in decimal?', a: 'FF is 15 × 16 + 15 = 255, the largest value in one byte. Its binary form is 1111 1111.' },
    { q: 'How do you convert binary to octal?', a: 'Group the bits in threes from the right instead of fours: 11 010 110 becomes 3, 2, 6, so 11010110 is 326 in octal.' },
    { q: 'What is the largest number you can store in n bits?', a: '2ⁿ − 1 unsigned. 8 bits hold 0 to 255, 16 bits 0 to 65,535 and 32 bits 0 to 4,294,967,295.' },
    { q: 'Does the case of hex letters matter?', a: 'No. D6, d6 and 0xD6 all mean the same value, 214. The converter accepts either case and shows capitals.' }
  ],
  related: ['scientific-notation-calculator', 'exponent-calculator', 'log-calculator'],
  sources: [
    { name: 'Microsoft Support: BIN2HEX function', url: 'https://support.microsoft.com/en-us/office/bin2hex-function-0375e507-f5e5-4077-9af8-28d84f9f41cc' },
    { name: 'Microsoft Support: DEC2BIN function', url: 'https://support.microsoft.com/en-us/office/dec2bin-function-0f63dd0e-5d1a-42d8-b511-5bf5c6d43838' },
    { name: 'Wolfram MathWorld: Hexadecimal', url: 'https://mathworld.wolfram.com/Hexadecimal.html' },
    { name: 'Wolfram MathWorld: Binary', url: 'https://mathworld.wolfram.com/Binary.html' }
  ]
};
