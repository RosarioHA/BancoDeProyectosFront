import { useState, createContext, useEffect, useCallback, useMemo } from 'react';
import { useProjectList } from '../hooks/useProjectList';
import isEqual from 'lodash/isEqual';



export const ApiContext = createContext();

export const ApiProvider = (props) =>
{
  const { children } = props;

  const initialFilterParams = JSON.parse(localStorage.getItem('filterParams')) || {
    program__in: [],
    comuna__region__in: [],
    comuna__in: [],
    type__in: [],
    year__in: [],
  };
  const initialSelectedFilters = JSON.parse(localStorage.getItem('selectedFilters')) || {
    program__in: [],
    comuna__region__in: [],
    comuna__in: [],
    type__in: [],
    year__in: [],
  };
  const initialPage = parseInt(localStorage.getItem('currentProjectPage'), 10) || 1;

  const [ searchTerm, setSearchTerm ] = useState('');
  const [ filterParams, setFilterParams ] = useState(initialFilterParams);
  const [ sortOrder, setSortOrder ] = useState('-year');
  const [ selectedFilters, setSelectedFilters ] = useState(initialSelectedFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { projects, metadata, loading, error, listProjects } = useProjectList();


  const updateProjects = useCallback(async () =>
  {
    const updatedFilterParams = {
    ...{program__in: selectedFilters.program__in,
      comuna__region__in: selectedFilters.comuna__region__in,
      comuna__in: selectedFilters.comuna__in,
      type__in: selectedFilters.type__in,
      year__in: selectedFilters.year__in,},
      page: currentPage
    };

    try
    {
      if (!isEqual(updatedFilterParams, filterParams))
      {
        listProjects(searchTerm, updatedFilterParams, sortOrder)     
        setFilterParams(updatedFilterParams);
      }
    } catch (error)
    {
      console.error('Error al cargar proyectos:', error);
    }
  }, [ listProjects, searchTerm, selectedFilters, sortOrder, filterParams, currentPage ]);

  useEffect(() =>
  {
    updateProjects();
  }, [ updateProjects, searchTerm, selectedFilters, sortOrder ]);

  useEffect(() =>
  {
    localStorage.setItem('filterParams', JSON.stringify(filterParams));
    localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
  }, [ filterParams, selectedFilters ]);

  const handleSortChange = (order) =>
  {
    setSortOrder(order);
  };

  useEffect(() => {
    localStorage.setItem('currentProjectPage', currentPage.toString());
  }, [currentPage]);

  const value = useMemo(() => ({
    projects,
    metadata, 
    listProjects,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterParams,
    setFilterParams,
    sortOrder,
    setSortOrder,
    handleSortChange,
    selectedFilters,
    setSelectedFilters,
    updateProjects,
    currentPage,
    setCurrentPage
  }), [projects, metadata, listProjects, loading, error, searchTerm, filterParams, sortOrder, selectedFilters, updateProjects, currentPage]);

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};
