import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getCountryCode, getCountryName, getCountryCodeFromNumericId, aggregateByCountry, aggregateByCities, getCountryColor, DEFAULT_COLOR_SCALE } from './mapData';

describe('Bug Condition Exploration - Numeric ID to Alpha-2 Conversion', () => {
  /**
   * Bug Condition Exploration Test
   * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
   * 
   * This test encodes the EXPECTED BEHAVIOR for numeric ID to alpha-2 conversion.
   * When run on UNFIXED code (function doesn't exist yet), this test MUST FAIL.
   * The failure confirms the bug exists.
   * 
   * After the fix is implemented, this test passing will confirm the bug is fixed.
   */
  describe('getCountryCodeFromNumericId', () => {
    it('should convert Fiji numeric ID "242" to alpha-2 code "FJ"', () => {
      const result = getCountryCodeFromNumericId("242");
      expect(result).toBe("FJ");
    });

    it('should convert Tanzania numeric ID "834" to alpha-2 code "TZ"', () => {
      const result = getCountryCodeFromNumericId("834");
      expect(result).toBe("TZ");
    });

    it('should convert Russia numeric ID "643" to alpha-2 code "RU"', () => {
      const result = getCountryCodeFromNumericId("643");
      expect(result).toBe("RU");
    });

    it('should return "XX" for unknown numeric ID "999"', () => {
      const result = getCountryCodeFromNumericId("999");
      expect(result).toBe("XX");
    });
  });
});

describe('Preservation - MapCanvas Logic for Non-Numeric IDs', () => {
  /**
   * Preservation Property Tests
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
   * 
   * These tests document the CURRENT behavior on UNFIXED code for non-buggy inputs.
   * They simulate the MapCanvas logic: `geo.id || geo.properties.ISO_A2 || 'XX'`
   * 
   * EXPECTED OUTCOME: These tests PASS on unfixed code (confirms baseline behavior).
   * After the fix, these tests must still PASS (confirms no regressions).
   */
  
  // Helper function that simulates the CURRENT MapCanvas logic
  const getCurrentMapCanvasLogic = (geo: { id?: string | null; properties?: { ISO_A2?: string | null } }): string => {
    return geo.id || geo.properties?.ISO_A2 || 'XX';
  };

  describe('Property 2: Preservation - Non-Numeric ID Behavior', () => {
    /**
     * Property-based test: Alpha-2 codes are returned unchanged
     * **Validates: Requirement 3.1**
     */
    it('should return alpha-2 codes unchanged', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Z]{2}$/),
          (alpha2Code) => {
            const geo = { id: alpha2Code };
            const result = getCurrentMapCanvasLogic(geo);
            expect(result).toBe(alpha2Code);
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Unit test: Specific alpha-2 codes
     * **Validates: Requirement 3.1**
     */
    it('should return specific alpha-2 codes unchanged', () => {
      expect(getCurrentMapCanvasLogic({ id: 'US' })).toBe('US');
      expect(getCurrentMapCanvasLogic({ id: 'RU' })).toBe('RU');
      expect(getCurrentMapCanvasLogic({ id: 'DE' })).toBe('DE');
      expect(getCurrentMapCanvasLogic({ id: 'FR' })).toBe('FR');
      expect(getCurrentMapCanvasLogic({ id: 'XK' })).toBe('XK'); // Kosovo
    });

    /**
     * Property-based test: ISO_A2 fallback works when geo.id is null
     * **Validates: Requirement 3.1**
     */
    it('should use ISO_A2 fallback when geo.id is null', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Z]{2}$/),
          (alpha2Code) => {
            const geo = { id: null, properties: { ISO_A2: alpha2Code } };
            const result = getCurrentMapCanvasLogic(geo);
            expect(result).toBe(alpha2Code);
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Unit test: ISO_A2 fallback with specific codes
     * **Validates: Requirement 3.1**
     */
    it('should use ISO_A2 fallback for specific cases', () => {
      expect(getCurrentMapCanvasLogic({ id: null, properties: { ISO_A2: 'DE' } })).toBe('DE');
      expect(getCurrentMapCanvasLogic({ id: undefined, properties: { ISO_A2: 'FR' } })).toBe('FR');
      expect(getCurrentMapCanvasLogic({ id: '', properties: { ISO_A2: 'GB' } })).toBe('GB');
    });

    /**
     * Property-based test: Unknown IDs return "XX"
     * **Validates: Requirement 3.2**
     */
    it('should return "XX" for unknown/missing IDs', () => {
      expect(getCurrentMapCanvasLogic({ id: null })).toBe('XX');
      expect(getCurrentMapCanvasLogic({ id: undefined })).toBe('XX');
      expect(getCurrentMapCanvasLogic({ id: '' })).toBe('XX');
      expect(getCurrentMapCanvasLogic({ id: null, properties: {} })).toBe('XX');
      expect(getCurrentMapCanvasLogic({ id: null, properties: { ISO_A2: null } })).toBe('XX');
      expect(getCurrentMapCanvasLogic({ id: null, properties: { ISO_A2: '' } })).toBe('XX');
    });

    /**
     * Property-based test: Non-numeric strings are returned as-is
     * **Validates: Requirement 3.2**
     * 
     * Note: The CURRENT behavior returns non-numeric strings unchanged.
     * This includes invalid codes like "ZZZ" or "ABC".
     * After the fix, numeric strings will be converted, but non-numeric strings
     * should still follow the same fallback logic.
     */
    it('should return non-numeric strings unchanged (current behavior)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => !/^\d+$/.test(s)),
          (nonNumericString) => {
            const geo = { id: nonNumericString };
            const result = getCurrentMapCanvasLogic(geo);
            // Current behavior: returns the string as-is
            expect(result).toBe(nonNumericString);
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Unit test: Specific non-numeric strings
     * **Validates: Requirement 3.2**
     */
    it('should handle specific non-numeric strings', () => {
      expect(getCurrentMapCanvasLogic({ id: 'XX' })).toBe('XX');
      expect(getCurrentMapCanvasLogic({ id: 'ZZ' })).toBe('ZZ');
      expect(getCurrentMapCanvasLogic({ id: 'ABC' })).toBe('ABC');
      expect(getCurrentMapCanvasLogic({ id: 'test' })).toBe('test');
    });
  });
});

describe('Country Code Conversion', () => {
  describe('getCountryCode', () => {
    /**
     * Property 19: Country Code Format
     * **Validates: Requirements 14.1, 14.3**
     * 
     * For any country name provided to getCountryCode, the returned value SHALL be 
     * a 2-character uppercase string in ISO 3166-1 alpha-2 format (or 'XX' for unknown).
     */
    it('Property 19: should always return a 2-character uppercase string', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (countryName) => {
            const result = getCountryCode(countryName);
            
            // Result must be exactly 2 characters
            expect(result).toHaveLength(2);
            
            // Result must be uppercase
            expect(result).toBe(result.toUpperCase());
            
            // Result must match ISO format (2 uppercase letters)
            expect(result).toMatch(/^[A-Z]{2}$/);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 20: Country Code Idempotence
     * **Validates: Requirements 14.2**
     * 
     * For any valid country code provided to getCountryCode, the function SHALL 
     * return the code unchanged.
     */
    it('Property 20: should be idempotent for valid country codes', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Z]{2}$/),
          (countryCode) => {
            const result = getCountryCode(countryCode);
            
            // Applying the function to a valid code should return it unchanged
            expect(result).toBe(countryCode);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return XX for unknown country names', () => {
      expect(getCountryCode('Unknown Country')).toBe('XX');
      expect(getCountryCode('Atlantis')).toBe('XX');
      expect(getCountryCode('Narnia')).toBe('XX');
    });

    it('should convert known country names to codes', () => {
      expect(getCountryCode('United States')).toBe('US');
      expect(getCountryCode('Russia')).toBe('RU');
      expect(getCountryCode('Germany')).toBe('DE');
      expect(getCountryCode('France')).toBe('FR');
    });

    it('should return existing codes unchanged', () => {
      expect(getCountryCode('US')).toBe('US');
      expect(getCountryCode('RU')).toBe('RU');
      expect(getCountryCode('DE')).toBe('DE');
    });
  });

  describe('getCountryName', () => {
    /**
     * Property 21: Country Name Conversion
     * **Validates: Requirements 14.4**
     * 
     * For any valid country code provided to getCountryName, the function SHALL 
     * return a non-empty string representing the full country name.
     */
    it('Property 21: should return non-empty string for any 2-letter code', () => {
      fc.assert(
        fc.property(
          fc.stringMatching(/^[A-Z]{2}$/),
          (countryCode) => {
            const result = getCountryName(countryCode);
            
            // Result must be non-empty
            expect(result.length).toBeGreaterThan(0);
            
            // Result must be a string
            expect(typeof result).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert known codes to country names', () => {
      expect(getCountryName('US')).toBe('United States');
      expect(getCountryName('RU')).toBe('Russia');
      expect(getCountryName('DE')).toBe('Germany');
      expect(getCountryName('FR')).toBe('France');
    });

    it('should return code itself for unknown codes', () => {
      expect(getCountryName('XX')).toBe('XX');
      expect(getCountryName('ZZ')).toBe('ZZ');
    });
  });
});


describe('Country Aggregation', () => {
  describe('aggregateByCountry', () => {
    /**
     * Property 1: Country Aggregation Grouping
     * **Validates: Requirement 2.1**
     * 
     * For any array of proxies, when aggregated by country, all proxies with the 
     * same country code SHALL be grouped together in a single CountryStats object.
     */
    it('Property 1: should group proxies by country code', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE', 'FR', 'GB'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            // Each country code should appear only once
            const countryCodes = result.map(s => s.countryCode);
            const uniqueCodes = new Set(countryCodes);
            expect(countryCodes.length).toBe(uniqueCodes.size);
            
            // All proxies with same country should be in same CountryStats
            for (const stats of result) {
              const expectedProxies = proxies.filter(
                p => p.country !== null && getCountryCode(p.country) === stats.countryCode
              );
              expect(stats.proxies.length).toBe(expectedProxies.length);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 2: Country Null Filtering
     * **Validates: Requirements 2.2, 15.1**
     * 
     * For any array of proxies containing proxies with null country fields, when 
     * aggregated by country, the resulting CountryStats array SHALL not include 
     * any proxies with null country fields.
     */
    it('Property 2: should filter out proxies with null country', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            // No CountryStats should contain proxies with null country
            for (const stats of result) {
              for (const proxy of stats.proxies) {
                expect(proxy.country).not.toBeNull();
              }
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 3: Country Statistics Calculation
     * **Validates: Requirement 2.3**
     * 
     * For any array of proxies, when aggregated by country, each CountryStats 
     * object SHALL have counts that match the filtered status arrays.
     */
    it('Property 3: should calculate correct status counts', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            for (const stats of result) {
              const online = stats.proxies.filter(p => p.status === 'online').length;
              const offline = stats.proxies.filter(p => p.status === 'offline').length;
              const unchecked = stats.proxies.filter(p => p.status === 'unchecked' || p.status === 'checking').length;
              
              expect(stats.onlineProxies).toBe(online);
              expect(stats.offlineProxies).toBe(offline);
              expect(stats.uncheckedProxies).toBe(unchecked);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 4: Average Latency Calculation
     * **Validates: Requirement 2.4**
     * 
     * For any array of proxies, when calculating average latency for a country, 
     * the calculation SHALL use only online proxies with non-null latency values.
     */
    it('Property 4: should calculate average latency from online proxies only', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            for (const stats of result) {
              const onlineWithLatency = stats.proxies
                .filter(p => p.status === 'online' && p.latency !== null)
                .map(p => p.latency as number);
              
              if (onlineWithLatency.length > 0) {
                const expectedAvg = onlineWithLatency.reduce((sum, l) => sum + l, 0) / onlineWithLatency.length;
                expect(stats.avgLatency).toBeCloseTo(expectedAvg, 2);
              } else {
                expect(stats.avgLatency).toBeNull();
              }
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 5: Country Sorting Order
     * **Validates: Requirement 2.5**
     * 
     * For any array of proxies, when aggregated by country, the resulting 
     * CountryStats array SHALL be sorted in descending order by totalProxies.
     */
    it('Property 5: should sort countries by total proxies descending', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE', 'FR'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            // Check that array is sorted descending by totalProxies
            for (let i = 1; i < result.length; i++) {
              expect(result[i - 1].totalProxies).toBeGreaterThanOrEqual(result[i].totalProxies);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 6: Country Total Consistency
     * **Validates: Requirement 2.6**
     * 
     * For all CountryStats objects, totalProxies SHALL equal the sum of 
     * onlineProxies, offlineProxies, and uncheckedProxies.
     */
    it('Property 6: should maintain total consistency', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            for (const stats of result) {
              const sum = stats.onlineProxies + stats.offlineProxies + stats.uncheckedProxies;
              expect(stats.totalProxies).toBe(sum);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 22: Non-Negative Counts
     * **Validates: Requirement 15.4**
     * 
     * For all CountryStats objects, all count fields SHALL be non-negative.
     */
    it('Property 22: should have non-negative counts', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.string(), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCountry(proxies);
            
            for (const stats of result) {
              expect(stats.totalProxies).toBeGreaterThanOrEqual(0);
              expect(stats.onlineProxies).toBeGreaterThanOrEqual(0);
              expect(stats.offlineProxies).toBeGreaterThanOrEqual(0);
              expect(stats.uncheckedProxies).toBeGreaterThanOrEqual(0);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});


  describe('aggregateByCountry - unit tests', () => {
    it('should return empty array for empty input', () => {
      const result = aggregateByCountry([]);
      expect(result).toEqual([]);
    });

    it('should filter out proxies with null countries', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: null, city: null, last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 200, country: 'US', city: null, last_checked: null },
      ];
      
      const result = aggregateByCountry(proxies);
      expect(result).toHaveLength(1);
      expect(result[0].countryCode).toBe('US');
    });

    it('should calculate correct statistics for mixed statuses', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'US', city: null, last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'offline' as const, latency: null, country: 'US', city: null, last_checked: null },
        { host: '3.3.3.3', port: 443, type: 'mtproto' as const, status: 'unchecked' as const, latency: null, country: 'US', city: null, last_checked: null },
      ];
      
      const result = aggregateByCountry(proxies);
      expect(result).toHaveLength(1);
      expect(result[0].totalProxies).toBe(3);
      expect(result[0].onlineProxies).toBe(1);
      expect(result[0].offlineProxies).toBe(1);
      expect(result[0].uncheckedProxies).toBe(1);
    });

    it('should calculate average latency correctly', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'US', city: null, last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 200, country: 'US', city: null, last_checked: null },
        { host: '3.3.3.3', port: 443, type: 'mtproto' as const, status: 'offline' as const, latency: null, country: 'US', city: null, last_checked: null },
      ];
      
      const result = aggregateByCountry(proxies);
      expect(result[0].avgLatency).toBe(150); // (100 + 200) / 2
    });

    it('should return null average latency when no online proxies with latency', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'offline' as const, latency: null, country: 'US', city: null, last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'unchecked' as const, latency: null, country: 'US', city: null, last_checked: null },
      ];
      
      const result = aggregateByCountry(proxies);
      expect(result[0].avgLatency).toBeNull();
    });

    it('should ignore offline proxies when calculating average latency', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'US', city: null, last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'offline' as const, latency: 999, country: 'US', city: null, last_checked: null },
      ];
      
      const result = aggregateByCountry(proxies);
      expect(result[0].avgLatency).toBe(100); // Only online proxy counted
    });
  });


describe('City Aggregation', () => {
  // Create a sample city coordinates map for testing
  const sampleCoordinates = new Map<string, [number, number]>([
    ['New York,US', [-74.006, 40.7128]],
    ['Los Angeles,US', [-118.2437, 34.0522]],
    ['Moscow,RU', [37.6173, 55.7558]],
    ['Berlin,DE', [13.405, 52.52]],
    ['Paris,FR', [2.3522, 48.8566]],
    ['London,GB', [-0.1276, 51.5074]],
  ]);

  describe('aggregateByCities', () => {
    /**
     * Property 7: City Aggregation Grouping
     * **Validates: Requirement 3.1**
     * 
     * For any array of proxies, when aggregated by city, all proxies with the 
     * same city and country combination SHALL be grouped together in a single 
     * CityMarker object.
     */
    it('Property 7: should group proxies by city and country', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE', 'FR', 'GB'), { nil: null }),
              city: fc.option(fc.constantFrom('New York', 'Los Angeles', 'Moscow', 'Berlin', 'Paris', 'London'), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCities(proxies, sampleCoordinates);
            
            // Each city+country combination should appear only once
            const cityKeys = result.map(m => `${m.city},${m.countryCode}`);
            const uniqueKeys = new Set(cityKeys);
            expect(cityKeys.length).toBe(uniqueKeys.size);
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 8: City Null Filtering
     * **Validates: Requirements 3.2, 15.2**
     * 
     * For any array of proxies containing proxies with null city or country fields, 
     * when aggregated by city, the resulting CityMarker array SHALL not include 
     * any proxies with null city or country fields.
     */
    it('Property 8: should filter out proxies with null city or country', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.constantFrom('New York', 'Moscow', 'Berlin'), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCities(proxies, sampleCoordinates);
            
            // All markers should have non-null city and country
            for (const marker of result) {
              expect(marker.city).not.toBeNull();
              expect(marker.countryCode).not.toBeNull();
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 9: City Coordinate Filtering
     * **Validates: Requirement 3.3**
     * 
     * For any array of proxies, when creating city markers, only cities with 
     * known geographic coordinates SHALL be included in the CityMarker array.
     */
    it('Property 9: should only include cities with known coordinates', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'US', city: 'New York', last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 200, country: 'US', city: 'Unknown City', last_checked: null },
      ];
      
      const result = aggregateByCities(proxies, sampleCoordinates);
      
      // Only New York should be included (Unknown City has no coordinates)
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe('New York');
    });

    /**
     * Property 10: City Sorting Order
     * **Validates: Requirement 3.5**
     * 
     * For any array of proxies, when aggregated by city, the resulting CityMarker 
     * array SHALL be sorted in descending order by proxyCount.
     */
    it('Property 10: should sort cities by proxy count descending', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.constantFrom('New York', 'Moscow', 'Berlin'), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCities(proxies, sampleCoordinates);
            
            // Check that array is sorted descending by proxyCount
            for (let i = 1; i < result.length; i++) {
              expect(result[i - 1].proxyCount).toBeGreaterThanOrEqual(result[i].proxyCount);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 11: Geographic Coordinate Validity
     * **Validates: Requirements 3.6, 15.3**
     * 
     * For all CityMarker objects, coordinates[0] SHALL be within [-180, 180] 
     * and coordinates[1] SHALL be within [-90, 90].
     */
    it('Property 11: should have valid geographic coordinates', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.constantFrom('New York', 'Moscow', 'Berlin'), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCities(proxies, sampleCoordinates);
            
            for (const marker of result) {
              const [lon, lat] = marker.coordinates;
              expect(lon).toBeGreaterThanOrEqual(-180);
              expect(lon).toBeLessThanOrEqual(180);
              expect(lat).toBeGreaterThanOrEqual(-90);
              expect(lat).toBeLessThanOrEqual(90);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    /**
     * Property 22: Non-Negative Counts
     * **Validates: Requirement 15.4**
     * 
     * For all CityMarker objects, all count fields SHALL be non-negative.
     */
    it('Property 22: should have non-negative counts', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              host: fc.string(),
              port: fc.integer({ min: 1, max: 65535 }),
              type: fc.constantFrom('mtproto' as const, 'socks5' as const),
              status: fc.constantFrom('checking' as const, 'online' as const, 'offline' as const, 'unchecked' as const),
              latency: fc.option(fc.integer({ min: 0, max: 5000 }), { nil: null }),
              country: fc.option(fc.constantFrom('US', 'RU', 'DE'), { nil: null }),
              city: fc.option(fc.constantFrom('New York', 'Moscow', 'Berlin'), { nil: null }),
              last_checked: fc.option(fc.integer(), { nil: null }),
            })
          ),
          (proxies) => {
            const result = aggregateByCities(proxies, sampleCoordinates);
            
            for (const marker of result) {
              expect(marker.proxyCount).toBeGreaterThanOrEqual(0);
              expect(marker.onlineCount).toBeGreaterThanOrEqual(0);
              expect(marker.offlineCount).toBeGreaterThanOrEqual(0);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('aggregateByCities - unit tests', () => {
    it('should return empty array for empty input', () => {
      const result = aggregateByCities([], sampleCoordinates);
      expect(result).toEqual([]);
    });

    it('should filter out cities without coordinates', () => {
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'US', city: 'New York', last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 200, country: 'US', city: 'Unknown City', last_checked: null },
      ];
      
      const result = aggregateByCities(proxies, sampleCoordinates);
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe('New York');
    });

    it('should handle duplicate city names in different countries', () => {
      const coords = new Map<string, [number, number]>([
        ['Paris,FR', [2.3522, 48.8566]],
        ['Paris,US', [-95.5555, 33.6609]], // Paris, Texas
      ]);
      
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'FR', city: 'Paris', last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 200, country: 'US', city: 'Paris', last_checked: null },
      ];
      
      const result = aggregateByCities(proxies, coords);
      expect(result).toHaveLength(2);
      expect(result.find(m => m.countryCode === 'FR')).toBeDefined();
      expect(result.find(m => m.countryCode === 'US')).toBeDefined();
    });

    it('should validate coordinates and skip invalid ones', () => {
      const invalidCoords = new Map<string, [number, number]>([
        ['Valid City,US', [-74.006, 40.7128]],
        ['Invalid Lon,US', [-200, 40.7128]], // Invalid longitude
        ['Invalid Lat,US', [-74.006, 100]], // Invalid latitude
      ]);
      
      const proxies = [
        { host: '1.1.1.1', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 100, country: 'US', city: 'Valid City', last_checked: null },
        { host: '2.2.2.2', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 200, country: 'US', city: 'Invalid Lon', last_checked: null },
        { host: '3.3.3.3', port: 443, type: 'mtproto' as const, status: 'online' as const, latency: 300, country: 'US', city: 'Invalid Lat', last_checked: null },
      ];
      
      const result = aggregateByCities(proxies, invalidCoords);
      expect(result).toHaveLength(1);
      expect(result[0].city).toBe('Valid City');
    });
  });

});


describe('Color Scale', () => {
  describe('getCountryColor', () => {
    /**
     * Property 12: Country Color Assignment
     * **Validates: Requirements 4.2, 10.3**
     * 
     * For any country with a non-zero proxy count, the assigned color SHALL be 
     * a teal shade from the color scale.
     */
    it('Property 12: should assign teal colors for non-zero proxy counts', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          (proxyCount) => {
            const color = getCountryColor(proxyCount);
            
            // Color should be a valid hex code
            expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
            
            // Color should not be gray (which is for zero proxies)
            expect(color).not.toBe('#e4e4e7');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 13: Color Scale Monotonicity
     * **Validates: Requirements 4.4, 10.4**
     * 
     * For all countries c1 and c2, if c1.proxyCount > c2.proxyCount, then the 
     * color assigned to c1 SHALL be darker than the color assigned to c2.
     */
    it('Property 13: should assign darker colors for higher proxy counts', () => {
      // Test at threshold boundaries
      const color0 = getCountryColor(0);
      const color1 = getCountryColor(1);
      const color5 = getCountryColor(5);
      const color10 = getCountryColor(10);
      const color20 = getCountryColor(20);
      
      // Each should be different
      expect(color0).not.toBe(color1);
      expect(color1).not.toBe(color5);
      expect(color5).not.toBe(color10);
      expect(color10).not.toBe(color20);
      
      // Zero should be gray
      expect(color0).toBe('#e4e4e7');
      
      // Higher counts should use colors later in the range
      const scale = DEFAULT_COLOR_SCALE;
      expect(color1).toBe(scale.range[1]);
      expect(color5).toBe(scale.range[2]);
      expect(color10).toBe(scale.range[3]);
      expect(color20).toBe(scale.range[4]);
    });
  });
});


  describe('getCountryColor - unit tests', () => {
    it('should return gray for zero proxy count', () => {
      const color = getCountryColor(0);
      expect(color).toBe('#e4e4e7');
    });

    it('should return correct colors at each threshold', () => {
      expect(getCountryColor(0)).toBe('#e4e4e7');
      expect(getCountryColor(1)).toBe('#99f6e4');
      expect(getCountryColor(4)).toBe('#99f6e4');
      expect(getCountryColor(5)).toBe('#5eead4');
      expect(getCountryColor(9)).toBe('#5eead4');
      expect(getCountryColor(10)).toBe('#2dd4bf');
      expect(getCountryColor(19)).toBe('#2dd4bf');
      expect(getCountryColor(20)).toBe('#14b8a6');
      expect(getCountryColor(100)).toBe('#14b8a6');
    });

    it('should handle proxy counts between thresholds', () => {
      expect(getCountryColor(3)).toBe('#99f6e4'); // Between 1 and 5
      expect(getCountryColor(7)).toBe('#5eead4'); // Between 5 and 10
      expect(getCountryColor(15)).toBe('#2dd4bf'); // Between 10 and 20
    });
  });
