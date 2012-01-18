using System.Collections.Generic;

namespace Dominio
{
    public interface IRepositorio<T>
    {
        void Delete(T item);
        IList<T> GetAll();
        void Insert(T item);
        void Save(T item);
        void Dispose();
        T Get(string id);
    }
}