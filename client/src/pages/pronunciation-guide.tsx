
import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PronunciationGuide() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Complete Pinyin Pronunciation Guide</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What is Pinyin?</h2>
            <p className="mb-4">
              Pinyin (拼音) is the official romanization system for Standard Chinese. It uses the Latin alphabet to represent the sounds of Mandarin Chinese, making it easier for learners to understand pronunciation before mastering Chinese characters.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Four Tones</h2>
            <p className="mb-4">
              Chinese is a tonal language, meaning the pitch of your voice changes the meaning of words. There are four main tones plus a neutral tone:
            </p>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Tone Marks and Descriptions</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>First Tone (ā)</strong> - High and flat, like saying "ahhhh" at the doctor</li>
              <li><strong>Second Tone (á)</strong> - Rising, like asking "what?" in English</li>
              <li><strong>Third Tone (ǎ)</strong> - Falling then rising, like "oh" when you're surprised</li>
              <li><strong>Fourth Tone (à)</strong> - Sharp falling, like giving a command "No!"</li>
              <li><strong>Neutral Tone (a)</strong> - Light and quick, unstressed</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Tone Examples</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>mā (妈)</strong> = mother</li>
              <li><strong>má (麻)</strong> = hemp</li>
              <li><strong>mǎ (马)</strong> = horse</li>
              <li><strong>mà (骂)</strong> = to scold</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Initials (Consonants)</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Simple Initials</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Pinyin</th>
                    <th className="border px-4 py-2">Sound</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">b</td>
                    <td className="border px-4 py-2">[p]</td>
                    <td className="border px-4 py-2">Like 'p' but unaspirated</td>
                    <td className="border px-4 py-2">bā (八)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">p</td>
                    <td className="border px-4 py-2">[pʰ]</td>
                    <td className="border px-4 py-2">Like 'p' with a puff of air</td>
                    <td className="border px-4 py-2">pā (趴)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">m</td>
                    <td className="border px-4 py-2">[m]</td>
                    <td className="border px-4 py-2">Like English 'm'</td>
                    <td className="border px-4 py-2">mā (妈)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">f</td>
                    <td className="border px-4 py-2">[f]</td>
                    <td className="border px-4 py-2">Like English 'f'</td>
                    <td className="border px-4 py-2">fā (发)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">d</td>
                    <td className="border px-4 py-2">[t]</td>
                    <td className="border px-4 py-2">Like 't' but unaspirated</td>
                    <td className="border px-4 py-2">dā (搭)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">t</td>
                    <td className="border px-4 py-2">[tʰ]</td>
                    <td className="border px-4 py-2">Like 't' with a puff of air</td>
                    <td className="border px-4 py-2">tā (他)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">n</td>
                    <td className="border px-4 py-2">[n]</td>
                    <td className="border px-4 py-2">Like English 'n'</td>
                    <td className="border px-4 py-2">nǎ (哪)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">l</td>
                    <td className="border px-4 py-2">[l]</td>
                    <td className="border px-4 py-2">Like English 'l'</td>
                    <td className="border px-4 py-2">lā (拉)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">g</td>
                    <td className="border px-4 py-2">[k]</td>
                    <td className="border px-4 py-2">Like 'k' but unaspirated</td>
                    <td className="border px-4 py-2">gāi (该)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">k</td>
                    <td className="border px-4 py-2">[kʰ]</td>
                    <td className="border px-4 py-2">Like 'k' with a puff of air</td>
                    <td className="border px-4 py-2">kāi (开)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">h</td>
                    <td className="border px-4 py-2">[x]</td>
                    <td className="border px-4 py-2">Like 'h' but more throaty</td>
                    <td className="border px-4 py-2">hǎo (好)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Sibilant Initials</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Pinyin</th>
                    <th className="border px-4 py-2">Sound</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">j</td>
                    <td className="border px-4 py-2">[tɕ]</td>
                    <td className="border px-4 py-2">Like 'j' in "jeep"</td>
                    <td className="border px-4 py-2">jī (鸡)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">q</td>
                    <td className="border px-4 py-2">[tɕʰ]</td>
                    <td className="border px-4 py-2">Like 'ch' in "cheap"</td>
                    <td className="border px-4 py-2">qī (七)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">x</td>
                    <td className="border px-4 py-2">[ɕ]</td>
                    <td className="border px-4 py-2">Like 'sh' but lighter</td>
                    <td className="border px-4 py-2">xī (西)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Retroflex Initials</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Pinyin</th>
                    <th className="border px-4 py-2">Sound</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">zh</td>
                    <td className="border px-4 py-2">[ʈʂ]</td>
                    <td className="border px-4 py-2">Like 'j' with tongue curled back</td>
                    <td className="border px-4 py-2">zhī (知)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">ch</td>
                    <td className="border px-4 py-2">[ʈʂʰ]</td>
                    <td className="border px-4 py-2">Like 'ch' with tongue curled back</td>
                    <td className="border px-4 py-2">chī (吃)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">sh</td>
                    <td className="border px-4 py-2">[ʂ]</td>
                    <td className="border px-4 py-2">Like 'sh' with tongue curled back</td>
                    <td className="border px-4 py-2">shī (是)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">r</td>
                    <td className="border px-4 py-2">[ʐ]</td>
                    <td className="border px-4 py-2">Like 'r' with tongue curled back</td>
                    <td className="border px-4 py-2">rì (日)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Dental Sibilants</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Pinyin</th>
                    <th className="border px-4 py-2">Sound</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">z</td>
                    <td className="border px-4 py-2">[ts]</td>
                    <td className="border px-4 py-2">Like 'ds' in "beds"</td>
                    <td className="border px-4 py-2">zài (在)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">c</td>
                    <td className="border px-4 py-2">[tsʰ]</td>
                    <td className="border px-4 py-2">Like 'ts' in "cats"</td>
                    <td className="border px-4 py-2">cài (菜)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">s</td>
                    <td className="border px-4 py-2">[s]</td>
                    <td className="border px-4 py-2">Like English 's'</td>
                    <td className="border px-4 py-2">sān (三)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Finals (Vowels and Endings)</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Simple Finals</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Pinyin</th>
                    <th className="border px-4 py-2">Sound</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">a</td>
                    <td className="border px-4 py-2">[a]</td>
                    <td className="border px-4 py-2">Like 'a' in "father"</td>
                    <td className="border px-4 py-2">mā (妈)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">o</td>
                    <td className="border px-4 py-2">[o]</td>
                    <td className="border px-4 py-2">Like 'aw' in "saw"</td>
                    <td className="border px-4 py-2">mó (摸)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">e</td>
                    <td className="border px-4 py-2">[ɤ]</td>
                    <td className="border px-4 py-2">Like 'e' in "her" (without r sound)</td>
                    <td className="border px-4 py-2">mé (么)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">i</td>
                    <td className="border px-4 py-2">[i]</td>
                    <td className="border px-4 py-2">Like 'ee' in "see"</td>
                    <td className="border px-4 py-2">mī (米)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">u</td>
                    <td className="border px-4 py-2">[u]</td>
                    <td className="border px-4 py-2">Like 'oo' in "moon"</td>
                    <td className="border px-4 py-2">mū (母)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">ü</td>
                    <td className="border px-4 py-2">[y]</td>
                    <td className="border px-4 py-2">Like 'u' with rounded lips</td>
                    <td className="border px-4 py-2">nǚ (女)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Compound Finals</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Pinyin</th>
                    <th className="border px-4 py-2">Sound</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">ai</td>
                    <td className="border px-4 py-2">[aɪ]</td>
                    <td className="border px-4 py-2">Like 'i' in "mine"</td>
                    <td className="border px-4 py-2">mái (买)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">ei</td>
                    <td className="border px-4 py-2">[eɪ]</td>
                    <td className="border px-4 py-2">Like 'ay' in "may"</td>
                    <td className="border px-4 py-2">méi (没)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">ao</td>
                    <td className="border px-4 py-2">[aʊ]</td>
                    <td className="border px-4 py-2">Like 'ow' in "cow"</td>
                    <td className="border px-4 py-2">máo (毛)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">ou</td>
                    <td className="border px-4 py-2">[oʊ]</td>
                    <td className="border px-4 py-2">Like 'o' in "go"</td>
                    <td className="border px-4 py-2">móu (某)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">an</td>
                    <td className="border px-4 py-2">[an]</td>
                    <td className="border px-4 py-2">Like 'an' in "ban"</td>
                    <td className="border px-4 py-2">mán (满)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">en</td>
                    <td className="border px-4 py-2">[ən]</td>
                    <td className="border px-4 py-2">Like 'en' in "broken"</td>
                    <td className="border px-4 py-2">mén (门)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">ang</td>
                    <td className="border px-4 py-2">[aŋ]</td>
                    <td className="border px-4 py-2">Like 'ang' in "hang"</td>
                    <td className="border px-4 py-2">máng (忙)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">eng</td>
                    <td className="border px-4 py-2">[əŋ]</td>
                    <td className="border px-4 py-2">Like 'ung' in "hung"</td>
                    <td className="border px-4 py-2">méng (蒙)</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">er</td>
                    <td className="border px-4 py-2">[ər]</td>
                    <td className="border px-4 py-2">Like 'er' in "her"</td>
                    <td className="border px-4 py-2">ér (儿)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Special Pronunciation Rules</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">The ü Sound</h3>
            <p className="mb-4">
              The ü (written as 'v' on some keyboards) is pronounced like the German 'ü' or French 'u'. To make this sound:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Shape your mouth to say 'ee'</li>
              <li>Round your lips as if saying 'oo'</li>
              <li>Keep your tongue in the 'ee' position</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">When ü Becomes u</h3>
            <p className="mb-4">
              After j, q, x, and y, the ü is written as 'u' but still pronounced as ü:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>ju (居) = jü</li>
              <li>qu (去) = qü</li>
              <li>xu (需) = xü</li>
              <li>yu (鱼) = yü</li>
            </ul>
            
            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Retroflex vs. Dental Sounds</h3>
            <p className="mb-4">
              This is one of the most challenging aspects for learners. Pay special attention to the difference between:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>zh, ch, sh, r (retroflex sounds with tongue curled back) and</li>
              <li>z, c, s (dental sounds with tongue touching teeth)</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
