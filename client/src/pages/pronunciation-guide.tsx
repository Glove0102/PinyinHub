
import React from 'react';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';

export default function PronunciationGuidePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center text-primary mb-6">Complete Pinyin Pronunciation Guide</h1>
          
          {/* What is Pinyin */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Pinyin?</h2>
            <p className="text-lg text-gray-700 mb-4">
              Pinyin (拼音) is the official romanization system for Standard Chinese. It uses the Latin alphabet to represent the sounds of Mandarin Chinese, making it easier for learners to understand pronunciation before mastering Chinese characters.
            </p>
          </section>
          
          {/* The Four Tones */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Four Tones</h2>
            <p className="text-lg text-gray-700 mb-4">
              Chinese is a tonal language, meaning the pitch of your voice changes the meaning of words. There are four main tones plus a neutral tone:
            </p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tone Marks and Descriptions</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>First Tone (ā)</strong> - High and flat, like saying "ahhhh" at the doctor</li>
                <li><strong>Second Tone (á)</strong> - Rising, like asking "what?" in English</li>
                <li><strong>Third Tone (ǎ)</strong> - Falling then rising, like "oh" when you're surprised</li>
                <li><strong>Fourth Tone (à)</strong> - Sharp falling, like giving a command "No!"</li>
                <li><strong>Neutral Tone (a)</strong> - Light and quick, unstressed</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tone Examples</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>mā (妈)</strong> = mother</li>
                <li><strong>má (麻)</strong> = hemp</li>
                <li><strong>mǎ (马)</strong> = horse</li>
                <li><strong>mà (骂)</strong> = to scold</li>
              </ul>
            </div>
          </section>
          
          {/* Consonants (Initials) */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Initials (Consonants)</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Simple Initials</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Pinyin</th>
                    <th className="py-2 px-4 border">Sound</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2 px-4 border">b</td><td className="py-2 px-4 border">[p]</td><td className="py-2 px-4 border">Like 'p' but unaspirated</td><td className="py-2 px-4 border">bā (八)</td></tr>
                  <tr><td className="py-2 px-4 border">p</td><td className="py-2 px-4 border">[pʰ]</td><td className="py-2 px-4 border">Like 'p' with a puff of air</td><td className="py-2 px-4 border">pā (趴)</td></tr>
                  <tr><td className="py-2 px-4 border">m</td><td className="py-2 px-4 border">[m]</td><td className="py-2 px-4 border">Like English 'm'</td><td className="py-2 px-4 border">mā (妈)</td></tr>
                  <tr><td className="py-2 px-4 border">f</td><td className="py-2 px-4 border">[f]</td><td className="py-2 px-4 border">Like English 'f'</td><td className="py-2 px-4 border">fā (发)</td></tr>
                  <tr><td className="py-2 px-4 border">d</td><td className="py-2 px-4 border">[t]</td><td className="py-2 px-4 border">Like 't' but unaspirated</td><td className="py-2 px-4 border">dā (搭)</td></tr>
                  <tr><td className="py-2 px-4 border">t</td><td className="py-2 px-4 border">[tʰ]</td><td className="py-2 px-4 border">Like 't' with a puff of air</td><td className="py-2 px-4 border">tā (他)</td></tr>
                  <tr><td className="py-2 px-4 border">n</td><td className="py-2 px-4 border">[n]</td><td className="py-2 px-4 border">Like English 'n'</td><td className="py-2 px-4 border">nǎ (哪)</td></tr>
                  <tr><td className="py-2 px-4 border">l</td><td className="py-2 px-4 border">[l]</td><td className="py-2 px-4 border">Like English 'l'</td><td className="py-2 px-4 border">lā (拉)</td></tr>
                  <tr><td className="py-2 px-4 border">g</td><td className="py-2 px-4 border">[k]</td><td className="py-2 px-4 border">Like 'k' but unaspirated</td><td className="py-2 px-4 border">gāi (该)</td></tr>
                  <tr><td className="py-2 px-4 border">k</td><td className="py-2 px-4 border">[kʰ]</td><td className="py-2 px-4 border">Like 'k' with a puff of air</td><td className="py-2 px-4 border">kāi (开)</td></tr>
                  <tr><td className="py-2 px-4 border">h</td><td className="py-2 px-4 border">[x]</td><td className="py-2 px-4 border">Like 'h' but more throaty</td><td className="py-2 px-4 border">hǎo (好)</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sibilant Initials</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Pinyin</th>
                    <th className="py-2 px-4 border">Sound</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2 px-4 border">j</td><td className="py-2 px-4 border">[tɕ]</td><td className="py-2 px-4 border">Like 'j' in "jeep"</td><td className="py-2 px-4 border">jī (鸡)</td></tr>
                  <tr><td className="py-2 px-4 border">q</td><td className="py-2 px-4 border">[tɕʰ]</td><td className="py-2 px-4 border">Like 'ch' in "cheap"</td><td className="py-2 px-4 border">qī (七)</td></tr>
                  <tr><td className="py-2 px-4 border">x</td><td className="py-2 px-4 border">[ɕ]</td><td className="py-2 px-4 border">Like 'sh' but lighter</td><td className="py-2 px-4 border">xī (西)</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Retroflex Initials</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Pinyin</th>
                    <th className="py-2 px-4 border">Sound</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2 px-4 border">zh</td><td className="py-2 px-4 border">[ʈʂ]</td><td className="py-2 px-4 border">Like 'j' with tongue curled back</td><td className="py-2 px-4 border">zhī (知)</td></tr>
                  <tr><td className="py-2 px-4 border">ch</td><td className="py-2 px-4 border">[ʈʂʰ]</td><td className="py-2 px-4 border">Like 'ch' with tongue curled back</td><td className="py-2 px-4 border">chī (吃)</td></tr>
                  <tr><td className="py-2 px-4 border">sh</td><td className="py-2 px-4 border">[ʂ]</td><td className="py-2 px-4 border">Like 'sh' with tongue curled back</td><td className="py-2 px-4 border">shī (是)</td></tr>
                  <tr><td className="py-2 px-4 border">r</td><td className="py-2 px-4 border">[ʐ]</td><td className="py-2 px-4 border">Like 'r' with tongue curled back</td><td className="py-2 px-4 border">rì (日)</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dental Sibilants</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Pinyin</th>
                    <th className="py-2 px-4 border">Sound</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2 px-4 border">z</td><td className="py-2 px-4 border">[ts]</td><td className="py-2 px-4 border">Like 'ds' in "beds"</td><td className="py-2 px-4 border">zài (在)</td></tr>
                  <tr><td className="py-2 px-4 border">c</td><td className="py-2 px-4 border">[tsʰ]</td><td className="py-2 px-4 border">Like 'ts' in "cats"</td><td className="py-2 px-4 border">cài (菜)</td></tr>
                  <tr><td className="py-2 px-4 border">s</td><td className="py-2 px-4 border">[s]</td><td className="py-2 px-4 border">Like English 's'</td><td className="py-2 px-4 border">sān (三)</td></tr>
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Finals (Vowels and Endings) */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Finals (Vowels and Endings)</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Simple Finals</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Pinyin</th>
                    <th className="py-2 px-4 border">Sound</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2 px-4 border">a</td><td className="py-2 px-4 border">[a]</td><td className="py-2 px-4 border">Like 'a' in "father"</td><td className="py-2 px-4 border">mā (妈)</td></tr>
                  <tr><td className="py-2 px-4 border">o</td><td className="py-2 px-4 border">[o]</td><td className="py-2 px-4 border">Like 'aw' in "saw"</td><td className="py-2 px-4 border">mó (摸)</td></tr>
                  <tr><td className="py-2 px-4 border">e</td><td className="py-2 px-4 border">[ɤ]</td><td className="py-2 px-4 border">Like 'e' in "her" (without r sound)</td><td className="py-2 px-4 border">mé (么)</td></tr>
                  <tr><td className="py-2 px-4 border">i</td><td className="py-2 px-4 border">[i]</td><td className="py-2 px-4 border">Like 'ee' in "see"</td><td className="py-2 px-4 border">mī (米)</td></tr>
                  <tr><td className="py-2 px-4 border">u</td><td className="py-2 px-4 border">[u]</td><td className="py-2 px-4 border">Like 'oo' in "moon"</td><td className="py-2 px-4 border">mū (母)</td></tr>
                  <tr><td className="py-2 px-4 border">ü</td><td className="py-2 px-4 border">[y]</td><td className="py-2 px-4 border">Like 'u' with rounded lips</td><td className="py-2 px-4 border">nǚ (女)</td></tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Compound Finals</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Pinyin</th>
                    <th className="py-2 px-4 border">Sound</th>
                    <th className="py-2 px-4 border">Description</th>
                    <th className="py-2 px-4 border">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-2 px-4 border">ai</td><td className="py-2 px-4 border">[aɪ]</td><td className="py-2 px-4 border">Like 'i' in "mine"</td><td className="py-2 px-4 border">mái (买)</td></tr>
                  <tr><td className="py-2 px-4 border">ei</td><td className="py-2 px-4 border">[eɪ]</td><td className="py-2 px-4 border">Like 'ay' in "may"</td><td className="py-2 px-4 border">méi (没)</td></tr>
                  <tr><td className="py-2 px-4 border">ao</td><td className="py-2 px-4 border">[aʊ]</td><td className="py-2 px-4 border">Like 'ow' in "cow"</td><td className="py-2 px-4 border">máo (毛)</td></tr>
                  <tr><td className="py-2 px-4 border">ou</td><td className="py-2 px-4 border">[oʊ]</td><td className="py-2 px-4 border">Like 'o' in "go"</td><td className="py-2 px-4 border">móu (某)</td></tr>
                  <tr><td className="py-2 px-4 border">an</td><td className="py-2 px-4 border">[an]</td><td className="py-2 px-4 border">Like 'an' in "ban"</td><td className="py-2 px-4 border">mán (满)</td></tr>
                  <tr><td className="py-2 px-4 border">en</td><td className="py-2 px-4 border">[ən]</td><td className="py-2 px-4 border">Like 'en' in "broken"</td><td className="py-2 px-4 border">mén (门)</td></tr>
                  <tr><td className="py-2 px-4 border">ang</td><td className="py-2 px-4 border">[aŋ]</td><td className="py-2 px-4 border">Like 'ang' in "hang"</td><td className="py-2 px-4 border">máng (忙)</td></tr>
                  <tr><td className="py-2 px-4 border">eng</td><td className="py-2 px-4 border">[əŋ]</td><td className="py-2 px-4 border">Like 'ung' in "hung"</td><td className="py-2 px-4 border">méng (蒙)</td></tr>
                  <tr><td className="py-2 px-4 border">er</td><td className="py-2 px-4 border">[ər]</td><td className="py-2 px-4 border">Like 'er' in "her"</td><td className="py-2 px-4 border">ér (儿)</td></tr>
                </tbody>
              </table>
            </div>
          </section>
          
          {/* Special Pronunciation Rules */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Pronunciation Rules</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The ü Sound</h3>
              <p className="text-gray-700 mb-2">The ü (written as 'v' on some keyboards) is pronounced like the German 'ü' or French 'u'. To make this sound:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Shape your mouth to say 'ee'</li>
                <li>Round your lips as if saying 'oo'</li>
                <li>Keep your tongue in the 'ee' position</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">When ü Becomes u</h3>
              <p className="text-gray-700 mb-2">After j, q, x, and y, the ü is written as 'u' but still pronounced as ü:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>ju (居) = jü</li>
                <li>qu (去) = qü</li>
                <li>xu (需) = xü</li>
                <li>yu (鱼) = yü</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Retroflex vs. Dental Sounds</h3>
              <p className="text-gray-700 mb-2">This is one of the most challenging aspects for learners:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Retroflex (zh, ch, sh, r): Curl your tongue tip back toward the roof of your mouth</li>
                <li>Dental (z, c, s): Keep your tongue tip behind your lower teeth</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tone Change Rules</h3>
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Third Tone Changes</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>When two third tones appear together, the first becomes second tone</li>
                  <li>Example: nǐ hǎo (你好) is pronounced ní hǎo</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">"One" (yī) and "No/Not" (bù) Changes</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>yī changes tone based on the following syllable</li>
                  <li>bù becomes bú before fourth tone syllables</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Common Pronunciation Mistakes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Pronunciation Mistakes</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For English Speakers</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Aspiration:</strong> Don't add extra puff of air to b, d, g</li>
                <li><strong>Retroflex sounds:</strong> Remember to curl your tongue back</li>
                <li><strong>Tone consistency:</strong> Maintain the tone throughout the entire syllable</li>
                <li><strong>ü sound:</strong> Don't substitute with 'oo' or 'ee'</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Tips</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Listen actively:</strong> Focus on native speaker pronunciation</li>
                <li><strong>Record yourself:</strong> Compare your pronunciation to native speakers</li>
                <li><strong>Practice tone pairs:</strong> Work on distinguishing similar tones</li>
                <li><strong>Use tone marks:</strong> Always include them when writing Pinyin</li>
                <li><strong>Start slow:</strong> Focus on accuracy before speed</li>
              </ul>
            </div>
          </section>
          
          {/* Quick Reference */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Reference: Difficult Sounds</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Most Challenging for Beginners</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>zh vs z:</strong> Retroflex vs dental</li>
                <li><strong>q vs ch:</strong> Aspirated palatals vs retroflexes</li>
                <li><strong>r:</strong> Retroflex approximant</li>
                <li><strong>ü:</strong> Rounded front vowel</li>
                <li><strong>Third tone:</strong> The dip and rise</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Memory Aids</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>b, d, g:</strong> "Soft" versions of p, t, k</li>
                <li><strong>Retroflex:</strong> "Tongue curled like a backwards 'C'"</li>
                <li><strong>Third tone:</strong> "Like a disappointed 'oh'"</li>
                <li><strong>ü:</strong> "Smile while saying 'oo'"</li>
              </ul>
            </div>
            
            <div className="mt-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-gray-800 italic">
                Remember: Consistent practice with authentic audio sources is key to mastering Pinyin pronunciation. Focus on accuracy over speed, and don't be afraid to exaggerate the tones when learning!
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
