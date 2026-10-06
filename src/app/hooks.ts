import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Typed Redux dispatch hook
 * Use throughout the application instead of plain useDispatch
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed Redux selector hook
 * Use throughout the application instead of plain useSelector
 */
export const useAppSelector = useSelector.withTypes<RootState>();
