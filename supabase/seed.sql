-- Seed heritage destinations, tickets, slots, and live stats
-- Run after 20260326120000_create_heritage_tourism_tables.sql

insert into public.heritage_destinations (slug, name, site_type, city, state, short_description, history, year_built, unesco, image_url, gallery, open_time, close_time, closed_days, latitude, longitude, daily_capacity)
values
(
  'taj-mahal',
  'Taj Mahal',
  'monument',
  'Agra',
  'Uttar Pradesh',
  'A white marble mausoleum on the Yamuna, built by Shah Jahan for Mumtaz Mahal.',
  'Commissioned in 1631 by Mughal emperor Shah Jahan after the death of his wife Mumtaz Mahal, the Taj Mahal took about 22 years and some 20,000 artisans to complete. The complex includes the main tomb, a mosque, a guest house, and formal gardens laid out in the Persian charbagh plan. Its white Makrana marble facade shifts tone through the day. In 1983 UNESCO listed it as a World Heritage Site for its architectural balance and craftsmanship.',
  '1632–1653',
  true,
  '/destinations/taj-mahal.jpg',
  '["/destinations/taj-mahal-2.jpg","/destinations/agra-fort.jpg"]'::jsonb,
  '06:00',
  '18:30',
  array['Friday'],
  27.1751,
  78.0421,
  40000
),
(
  'red-fort',
  'Red Fort',
  'fort',
  'Delhi',
  'Delhi',
  'The sandstone seat of Mughal power and the site of India''s Independence Day address.',
  'Shah Jahan moved the Mughal capital from Agra to Shahjahanabad in 1639 and raised the Red Fort as the imperial palace. Its red sandstone walls enclose audience halls, private apartments, and gardens. From 1947 the Prime Minister has addressed the nation from its ramparts every Independence Day. UNESCO inscribed the fort in 2007.',
  '1639–1648',
  true,
  '/destinations/red-fort.jpg',
  '["/destinations/humayun-tomb.jpg"]'::jsonb,
  '09:30',
  '16:30',
  array['Monday'],
  28.6562,
  77.2410,
  25000
),
(
  'qutub-minar',
  'Qutub Minar',
  'monument',
  'Delhi',
  'Delhi',
  'A soaring victory tower of red sandstone and marble at Mehrauli.',
  'Begun by Qutb-ud-din Aibak around 1199 and completed by Iltutmish, Qutub Minar rises 72.5 metres. The complex also holds the Quwwat-ul-Islam mosque and the Iron Pillar. UNESCO listed the Qutb complex in 1993.',
  '1199–1220',
  true,
  '/destinations/qutub-minar.jpg',
  '["/destinations/humayun-tomb.jpg"]'::jsonb,
  '07:00',
  '17:00',
  array[]::text[],
  28.5245,
  77.1855,
  15000
),
(
  'india-gate',
  'India Gate',
  'monument',
  'New Delhi',
  'Delhi',
  'A war memorial arch on Rajpath honouring soldiers of the First World War.',
  'Designed by Edwin Lutyens and completed in 1931, India Gate commemorates 74,187 soldiers of the British Indian Army who died in the First World War and the Third Anglo-Afghan War. The Amar Jawan Jyoti flame burns beneath the arch. The surrounding lawns are one of Delhi''s busiest public spaces.',
  '1921–1931',
  false,
  '/destinations/india-gate.jpg',
  '["/destinations/red-fort.jpg"]'::jsonb,
  '00:00',
  '23:59',
  array[]::text[],
  28.6129,
  77.2295,
  50000
),
(
  'national-museum-delhi',
  'National Museum',
  'museum',
  'New Delhi',
  'Delhi',
  'India''s premier museum of archaeology, manuscripts, and decorative arts.',
  'Opened in 1949 and housed on Janpath since 1960, the National Museum holds over 200,000 objects spanning 5,000 years. Collections cover Indus Valley archaeology, Buddhist art, numismatics, arms, and textiles. Special galleries rotate loans and temporary exhibitions.',
  '1949',
  false,
  '/destinations/museum.jpg',
  '["/destinations/sarnath.jpg"]'::jsonb,
  '10:00',
  '18:00',
  array['Monday'],
  28.6118,
  77.2194,
  8000
),
(
  'agra-fort',
  'Agra Fort',
  'fort',
  'Agra',
  'Uttar Pradesh',
  'A riverside fortress of red sandstone that housed Mughal emperors for generations.',
  'Akbar began the present fort in 1565. Later emperors added marble palaces, mosques, and audience halls. Shah Jahan was confined here by Aurangzeb and could see the Taj Mahal across the Yamuna. UNESCO listed Agra Fort in 1983.',
  '1565–1573',
  true,
  '/destinations/agra-fort.jpg',
  '["/destinations/taj-mahal-2.jpg"]'::jsonb,
  '06:00',
  '18:00',
  array[]::text[],
  27.1795,
  78.0211,
  20000
),
(
  'humauns-tomb',
  'Humayun''s Tomb',
  'heritage_site',
  'Delhi',
  'Delhi',
  'An early Mughal garden tomb that set the pattern later perfected at the Taj Mahal.',
  'Built in the 1560s by Empress Bega Begum for Humayun, the tomb sits in a charbagh garden. Persian and Indian craftsmen worked the red sandstone and white marble. UNESCO inscribed it in 1993. A major ASI and Aga Khan Trust restoration returned gardens and water channels.',
  '1565–1572',
  true,
  '/destinations/humayun-tomb.jpg',
  '["/destinations/red-fort.jpg"]'::jsonb,
  '06:00',
  '18:00',
  array[]::text[],
  28.5933,
  77.2507,
  12000
),
(
  'sarnath-museum',
  'Sarnath Museum',
  'museum',
  'Sarnath',
  'Uttar Pradesh',
  'The oldest site museum of the Archaeological Survey of India, beside the deer park where the Buddha taught.',
  'Opened in 1910, the museum holds finds from Sarnath excavations including the Ashokan Lion Capital, now India''s national emblem. Galleries cover Buddhist sculpture from the Mauryan to medieval periods. Entry is timed with the archaeological park next door.',
  '1910',
  false,
  '/destinations/sarnath.jpg',
  '[]'::jsonb,
  '09:00',
  '17:00',
  array['Friday'],
  25.3811,
  83.0224,
  5000
);

with dest as (
  select id, slug from public.heritage_destinations
)
insert into public.heritage_ticket_types (destination_id, name, audience, price_inr, description, includes, sort_order)
select d.id, v.name, v.audience, v.price_inr, v.description, v.includes, v.sort_order
from dest d
join (values
  ('taj-mahal', 'General entry (Indian)', 'indian', 50, 'Entry to the complex gardens and viewing platforms.', array['Gardens','Museum'], 1),
  ('taj-mahal', 'General entry (Foreign)', 'foreign', 1100, 'Entry for international visitors including ASI museum.', array['Gardens','Museum','Audio guide option'], 2),
  ('taj-mahal', 'Student entry', 'student', 20, 'Valid student ID required at the gate.', array['Gardens'], 3),
  ('red-fort', 'General entry (Indian)', 'indian', 35, 'Access to the fort complex and museums on site.', array['Fort grounds','Museums'], 1),
  ('red-fort', 'General entry (Foreign)', 'foreign', 500, 'International visitor ticket.', array['Fort grounds','Museums'], 2),
  ('qutub-minar', 'General entry (Indian)', 'indian', 35, 'Entry to the Qutb complex.', array['Complex grounds'], 1),
  ('qutub-minar', 'General entry (Foreign)', 'foreign', 600, 'International visitor ticket.', array['Complex grounds'], 2),
  ('india-gate', 'Lawn access', 'indian', 0, 'Public memorial grounds. No ticket required.', array['Lawn access'], 1),
  ('national-museum-delhi', 'General entry (Indian)', 'indian', 20, 'Access to permanent galleries.', array['Permanent galleries'], 1),
  ('national-museum-delhi', 'General entry (Foreign)', 'foreign', 650, 'International visitor ticket.', array['Permanent galleries','Temporary shows'], 2),
  ('national-museum-delhi', 'Student entry', 'student', 5, 'Valid student ID required.', array['Permanent galleries'], 3),
  ('agra-fort', 'General entry (Indian)', 'indian', 40, 'Entry to Agra Fort.', array['Fort complex'], 1),
  ('agra-fort', 'General entry (Foreign)', 'foreign', 550, 'International visitor ticket.', array['Fort complex'], 2),
  ('humauns-tomb', 'General entry (Indian)', 'indian', 35, 'Entry to the tomb and gardens.', array['Gardens','Tomb'], 1),
  ('humauns-tomb', 'General entry (Foreign)', 'foreign', 550, 'International visitor ticket.', array['Gardens','Tomb'], 2),
  ('sarnath-museum', 'Museum entry', 'indian', 5, 'ASI museum galleries.', array['Museum galleries'], 1),
  ('sarnath-museum', 'Museum entry (Foreign)', 'foreign', 100, 'International visitor ticket.', array['Museum galleries'], 2)
) as v(slug, name, audience, price_inr, description, includes, sort_order)
  on d.slug = v.slug;

insert into public.heritage_time_slots (destination_id, slot_date, start_time, end_time, capacity, booked, expected_crowd)
select
  d.id,
  (current_date + offs.day_offset)::date,
  s.start_time::time,
  s.end_time::time,
  greatest(200, (d.daily_capacity / 8))::int,
  least(
    greatest(200, (d.daily_capacity / 8)),
    ((greatest(200, (d.daily_capacity / 8)) * s.fill_pct) / 100)::int
  ),
  case
    when s.fill_pct < 40 then 'low'
    when s.fill_pct < 65 then 'moderate'
    when s.fill_pct < 85 then 'high'
    else 'peak'
  end
from public.heritage_destinations d
cross join (values (0), (1), (2), (3), (4), (5), (6)) as offs(day_offset)
cross join (values
  ('06:00', '08:00', 35),
  ('08:00', '10:00', 72),
  ('10:00', '12:00', 88),
  ('12:00', '14:00', 55),
  ('14:00', '16:00', 68),
  ('16:00', '18:00', 80)
) as s(start_time, end_time, fill_pct)
where d.slug <> 'india-gate';

insert into public.heritage_time_slots (destination_id, slot_date, start_time, end_time, capacity, booked, expected_crowd)
select
  d.id,
  (current_date + offs.day_offset)::date,
  s.start_time::time,
  s.end_time::time,
  5000,
  ((5000 * s.fill_pct) / 100)::int,
  case
    when s.fill_pct < 40 then 'low'
    when s.fill_pct < 65 then 'moderate'
    when s.fill_pct < 85 then 'high'
    else 'peak'
  end
from public.heritage_destinations d
cross join (values (0), (1), (2), (3), (4), (5), (6)) as offs(day_offset)
cross join (values
  ('06:00', '09:00', 30),
  ('09:00', '12:00', 70),
  ('12:00', '15:00', 85),
  ('15:00', '18:00', 90),
  ('18:00', '21:00', 95),
  ('21:00', '23:59', 60)
) as s(start_time, end_time, fill_pct)
where d.slug = 'india-gate';

insert into public.heritage_entry_stats (destination_id, recorded_at, entries_today, exits_today, current_inside, queue_minutes, crowd_level)
select
  d.id,
  now(),
  case d.slug
    when 'taj-mahal' then 18420
    when 'red-fort' then 9210
    when 'qutub-minar' then 6540
    when 'india-gate' then 22100
    when 'national-museum-delhi' then 1840
    when 'agra-fort' then 7120
    when 'humauns-tomb' then 3980
    else 920
  end,
  case d.slug
    when 'taj-mahal' then 12100
    when 'red-fort' then 6100
    when 'qutub-minar' then 4200
    when 'india-gate' then 15000
    when 'national-museum-delhi' then 1100
    when 'agra-fort' then 4800
    when 'humauns-tomb' then 2500
    else 600
  end,
  case d.slug
    when 'taj-mahal' then 6320
    when 'red-fort' then 3110
    when 'qutub-minar' then 2340
    when 'india-gate' then 7100
    when 'national-museum-delhi' then 740
    when 'agra-fort' then 2320
    when 'humauns-tomb' then 1480
    else 320
  end,
  case d.slug
    when 'taj-mahal' then 35
    when 'red-fort' then 18
    when 'qutub-minar' then 12
    when 'india-gate' then 0
    when 'national-museum-delhi' then 8
    when 'agra-fort' then 15
    when 'humauns-tomb' then 10
    else 5
  end,
  case d.slug
    when 'taj-mahal' then 'high'
    when 'red-fort' then 'moderate'
    when 'qutub-minar' then 'moderate'
    when 'india-gate' then 'peak'
    when 'national-museum-delhi' then 'low'
    when 'agra-fort' then 'moderate'
    when 'humauns-tomb' then 'low'
    else 'low'
  end
from public.heritage_destinations d;
